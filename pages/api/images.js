import { Folder } from "../../models/Folder";

export default async function handler(req, res) {
	const { method } = req;

	if (method === "GET") {
		try {
			const folders = await Folder.find().sort({ name: 1 });
			const images = folders.flatMap((folder) => folder.images);
			res.json(images);
		} catch (error) {
			res.status(500).json({ error: "Failed to fetch images" });
		}
	}
}
