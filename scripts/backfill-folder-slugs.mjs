import dotenv from "dotenv";

// Load env vars for scripts (Next.js loads these automatically, Node does not)
// Prefer .env.local if present.
dotenv.config({ path: ".env.local" });
// Fallback to .env
dotenv.config();

import { mongooseConnect } from "../lib/mongoose.js";
import { Folder } from "../models/Folder.js";

function slugify(text) {
	return String(text || "")
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

async function run() {
	const uri =
		process.env.MONGODB_URI ||
		process.env.MONGO_URL ||
		process.env.DATABASE_URL ||
		process.env.MONGODB_URL;

	if (!uri) {
		throw new Error(
			"Missing MongoDB connection string. Set MONGODB_URI (or MONGO_URL/DATABASE_URL) in .env.local before running this script."
		);
	}

	await mongooseConnect();

	const folders = await Folder.find();
	let updated = 0;

	for (const f of folders) {
		if (!f.slug) {
			let base = slugify(f.name);
			if (!base) base = `folder-${f._id.toString().slice(-6)}`;

			// Ensure uniqueness: wedding, wedding-2, wedding-3, ...
			let candidate = base;
			let i = 2;
			// eslint-disable-next-line no-await-in-loop
			while (await Folder.findOne({ slug: candidate })) {
				candidate = `${base}-${i++}`;
			}

			f.slug = candidate;
			await f.save();
			updated++;
			console.log(`✅ ${f.name} -> ${f.slug}`);
		}
	}

	console.log(`\nDone. Updated ${updated} folders.`);
	process.exit(0);
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
