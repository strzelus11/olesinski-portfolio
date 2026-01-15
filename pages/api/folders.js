import { mongooseConnect } from "lib/mongoose";
import { Folder } from "models/Folder";

function slugify(text) {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-");
}

function withEffectiveCover(folderDoc) {
	if (!folderDoc) return folderDoc;
	const obj = folderDoc.toObject ? folderDoc.toObject() : folderDoc;
	return {
		...obj,
		effectiveCoverImage: obj.coverImage || obj.images?.[0] || null,
	};
}

export default async function handle(req, res) {
	const { method } = req;
	await mongooseConnect();

	if (method === "GET") {
		const { _id, slug } = req.query;

		try {
			// Single folder by id
			if (_id) {
				const folder = await Folder.findById(_id);
				if (!folder) return res.status(404).json({ error: "Folder not found" });
				return res.json(withEffectiveCover(folder));
			}

			// Single folder by slug
			if (slug) {
				const folder = await Folder.findOne({ slug });
				if (!folder) return res.status(404).json({ error: "Folder not found" });
				return res.json(withEffectiveCover(folder));
			}

			// List folders
			const folders = await Folder.find().sort({ order: 1 });
			return res.json(folders.map(withEffectiveCover));
		} catch (error) {
			console.error("Error fetching folder(s):", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	}

	if (method === "POST") {
		const { name, order } = req.body;
		if (!name) return res.status(400).json({ error: "Name required" });

		const slug = slugify(name);

		const folder = await Folder.create({
			name,
			slug,
			images: [],
			coverImage: null,
			order,
		});

		return res.json(folder);
	}

	if (method === "PUT") {
		const { _id, images, coverImage, order } = req.body;

		if (!_id) {
			return res.status(400).json({ error: "Folder ID is required" });
		}

		// Fetch current folder to validate updates safely
		const existing = await Folder.findById(_id);
		if (!existing) {
			return res.status(404).json({ error: "Folder not found" });
		}

		// Determine the next images array (if not provided, keep existing)
		const nextImages = Array.isArray(images) ? images : existing.images;

		// Determine the next coverImage value:
		// - if coverImage is explicitly provided (including null), use it
		// - otherwise keep existing
		let nextCover = req.body.hasOwnProperty("coverImage")
			? coverImage
			: existing.coverImage;

		// If the client is updating images (not cover) and the current cover was removed,
		// automatically clear the cover so we don't block deletions.
		if (!req.body.hasOwnProperty("coverImage")) {
			if (
				typeof nextCover === "string" &&
				nextCover &&
				!nextImages.includes(nextCover)
			) {
				nextCover = null;
			}
		}

		// Validate cover image belongs to folder images (unless null)
		if (nextCover !== null && typeof nextCover !== "undefined") {
			if (typeof nextCover !== "string" || !nextImages.includes(nextCover)) {
				return res.status(400).json({
					error:
						"Invalid coverImage. It must be one of the folder images (or null).",
				});
			}
		}

		await Folder.updateOne(
			{ _id },
			{
				images: nextImages,
				coverImage: nextCover,
				...(typeof order === "number" ? { order } : {}),
			}
		);

		const updated = await Folder.findById(_id);
		return res.json(withEffectiveCover(updated));
	}

	if (method === "DELETE") {
		const { _id } = req.query;
		if (!_id) {
			return res.status(400).json({ error: "Folder ID is required" });
		}
		await Folder.deleteOne({ _id });
		return res.json("ok");
	}

	res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
	return res.status(405).json({ error: "Method not allowed" });
}
