import { mongooseConnect } from "../../lib/mongoose";
import { Folder } from "../../models/Folder";

export default async function handle(req, res) {
	const { method } = req;
	await mongooseConnect();

	if (method === "PUT") {
		const { folders } = req.body;

		if (!Array.isArray(folders) || folders.some((folder) => !folder._id)) {
			return res.status(400).json({ error: "Invalid folders array." });
		}

		try {
			const session = await Folder.startSession();
			session.startTransaction();

			for (let index = 0; index < folders.length; index++) {
				const folder = folders[index];
				await Folder.updateOne(
					{ _id: folder._id },
					{ order: index },
					{ session }
				);
			}

			await session.commitTransaction();
			session.endSession();

			res.json({ message: "Order updated successfully." });
		} catch (error) {
			console.error("Error updating folder order:", error);

			try {
				await session.abortTransaction();
				session.endSession();
			} catch (abortError) {
				console.error("Failed to abort transaction:", abortError);
			}

			res.status(500).json({ error: "Failed to update order." });
		}
	} else {
		res.status(405).json({ error: "Method not allowed." });
	}
}
