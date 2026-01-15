import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import multiparty from "multiparty";
import fs from "fs";
import mime from "mime-types";

// NOTE:
// This endpoint receives multipart form-data and uploads files to S3.
// Fixes vs previous version:
// - uses streaming (createReadStream) instead of fs.readFileSync (prevents RAM spikes/timeouts)
// - validates method
// - better mime detection
// - better error handling + safer file normalization
// - supports optional folder prefix via `folderId` (field name: folderId)

const bucket = process.env.AWS_S3_BUCKET || "olesinski-portfolio";
const region = process.env.AWS_REGION || "us-east-1";

function getS3Client() {
	const rawAccessKeyId =
		process.env.AWS_ACCESS_KEY_ID ?? process.env.ACCESS_KEY ?? "";
	const rawSecretAccessKey =
		process.env.AWS_SECRET_ACCESS_KEY ?? process.env.SECRET_KEY ?? "";
	const rawSessionToken =
		process.env.AWS_SESSION_TOKEN ?? process.env.SESSION_TOKEN ?? "";

	// Hosting dashboards sometimes store values with quotes or trailing newlines.
	const clean = (v) =>
		String(v).trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");

	const accessKeyId = clean(rawAccessKeyId);
	const secretAccessKey = clean(rawSecretAccessKey);
	let sessionToken = rawSessionToken ? clean(rawSessionToken) : undefined;

	// Session tokens are ONLY valid for temporary credentials (typically access keys starting with ASIA).
	// If we ever have a stray token in the environment while using AKIA keys, AWS can return
	// "The provided token is malformed or otherwise invalid.".
	if (sessionToken && !String(accessKeyId).startsWith("ASIA")) {
		sessionToken = undefined;
	}

	if (!accessKeyId || !secretAccessKey) {
		throw new Error(
			"Missing AWS credentials. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY (or legacy ACCESS_KEY/SECRET_KEY)."
		);
	}

	// Safe debug log (never log the secret). Helps diagnose prod env issues.
	console.log(
		"[upload] AWS creds present:",
		`${accessKeyId.slice(0, 4)}…${accessKeyId.slice(-4)}`,
		"region:",
		region,
		"bucket:",
		bucket,
		"sessionToken:",
		Boolean(rawSessionToken)
	);

	return new S3Client({
		region,
		credentials: sessionToken
			? { accessKeyId, secretAccessKey, sessionToken }
			: { accessKeyId, secretAccessKey },
	});
}

function parseForm(req) {
	return new Promise((resolve, reject) => {
		const form = new multiparty.Form({
			// 50MB per request (adjust if needed)
			maxFilesSize: 50 * 1024 * 1024,
		});

		form.parse(req, (err, fields, files) => {
			if (err) return reject(err);
			resolve({ fields, files });
		});
	});
}

function normalizeFiles(files) {
	// multiparty returns arrays; also handle unexpected shapes safely
	const f = files?.file;
	if (!f) return [];
	return Array.isArray(f) ? f : [f];
}

function safeFolderPrefix(raw) {
	// allow only simple folder ids (avoid path traversal / weird keys)
	if (!raw) return "";
	const cleaned = String(raw)
		.trim()
		.replace(/[^a-zA-Z0-9_-]/g, "");
	return cleaned ? `folders/${cleaned}/` : "";
}

export default async function handle(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const { fields, files } = await parseForm(req);
		const fileList = normalizeFiles(files);

		if (!fileList.length) {
			return res
				.status(400)
				.json({ error: "No files received (field name must be 'file')" });
		}

		const folderId = Array.isArray(fields?.folderId)
			? fields.folderId[0]
			: fields?.folderId;
		const prefix = safeFolderPrefix(folderId);

		const client = getS3Client();

		const links = [];
		const keys = [];

		for (const file of fileList) {
			// multiparty file: { originalFilename, path, headers, size }
			const original = file.originalFilename || "upload";
			const extFromName = original.includes(".")
				? original.split(".").pop()
				: "";
			const contentType =
				(file.headers &&
					(file.headers["content-type"] || file.headers["Content-Type"])) ||
				mime.lookup(original) ||
				"application/octet-stream";

			const ext = extFromName || mime.extension(contentType) || "bin";
			const newFilename = `${Date.now()}-${Math.random()
				.toString(16)
				.slice(2)}.${ext}`;
			const key = `${prefix}${newFilename}`;

			await client.send(
				new PutObjectCommand({
					Bucket: bucket,
					Key: key,
					Body: fs.createReadStream(file.path),
					ContentType: contentType,
					// IMPORTANT:
					// Using ACL here requires bucket settings that allow ACLs.
					// If your bucket has "Object Ownership: Bucket owner enforced", remove ACL.
					CacheControl: "public, max-age=31536000, immutable",
				})
			);

			const link = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
			links.push(link);
			keys.push(key);

			// Cleanup temp file (best-effort)
			try {
				fs.unlinkSync(file.path);
			} catch (_) {}
		}

		return res.status(200).json({ links, keys });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Upload failed";
		// multiparty uses specific errors for size limits
		const status = /maxFilesSize/i.test(message) ? 413 : 500;

		// Help debug AWS auth issues in prod without leaking secrets
		const maybeAwsAuth =
			/Access Key Id|InvalidAccessKeyId|SignatureDoesNotMatch|security token/i.test(
				message
			);
		return res.status(status).json({
			error: message,
			...(maybeAwsAuth
				? {
						hint: "Check AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY (and AWS_SESSION_TOKEN if using temporary ASIA keys) in the production environment and redeploy.",
				  }
				: {}),
		});
	}
}

export const config = {
	api: { bodyParser: false },
};
