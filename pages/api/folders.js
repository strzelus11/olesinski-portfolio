import { mongooseConnect } from "../../lib/mongoose";
import { Folder } from "models/Folder";

export default async function handle(req, res) {
	const { method } = req;
	await mongooseConnect();

	if (method === "GET") {
		const { _id } = req.query;

		try {
			if (_id) {
				const folder = await Folder.findById(_id);
				if (!folder) {
					return res.status(404).json({ error: "Folder not found" });
				}
				res.json(folder);
			} else {
				const folders = await Folder.find().sort({ order: 1 });
				res.json(folders);
			}
		} catch (error) {
			console.error("Error fetching folder(s):", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	if (method === "POST") {
		const { name } = req.body;
		if (!name) {
			return res.status(400).json({ error: "Folder name is required" });
		}
		const folder = await Folder.create({ name, images: [] });
		res.json(folder);
	}

	if (method === "PUT") {
		const { _id, images } = req.body;
		if (!_id || !Array.isArray(images)) {
			return res
				.status(400)
				.json({ error: "Invalid request: Folder ID and images are required." });
		}
		const folder = await Folder.updateOne({ _id }, { images });
		res.json(folder);
	}

	if (method === "DELETE") {
		const { _id } = req.query;
		if (!_id) {
			return res.status(400).json({ error: "Folder ID is required" });
		}
		await Folder.deleteOne({ _id });
		res.json("ok");
	}
}
