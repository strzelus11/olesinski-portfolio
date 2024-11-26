import { mongooseConnect } from "../../lib/mongoose";
import { Folder } from "../../models/Folder";

export default async function handle(req, res) {
	const { method } = req;
	await mongooseConnect();

	if (method === "PUT") {
		const { folders } = req.body;

		if (!Array.isArray(folders) || folders.some((folder) => !folder._id)) {
			return res.status(400).json({ error: "Invalid folder data." });
		}

		try {
			const bulkOps = folders.map((folder, index) => ({
				updateOne: {
					filter: { _id: folder._id },
					update: { $set: { order: index } },
				},
			}));

			await Folder.bulkWrite(bulkOps);

			res.json({ message: "Folders reordered successfully." });
		} catch (error) {
			console.error("Error reordering folders:", error);
			res.status(500).json({ error: "Failed to reorder folders" });
		}
	}
}
