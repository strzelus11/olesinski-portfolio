import { mongooseConnect } from "lib/mongoose";
import { Featured } from "../../models/Featured";

export default async function handle(req, res) {
	const { method } = req;
	await mongooseConnect();

	if (method === "GET") {
		const featured = await Featured.findOne();
		res.json({ images: featured?.images || [] });
	}

	if (method === "POST") {
		const { images } = req.body;

		if (!Array.isArray(images)) {
			return res.status(400).json({ error: "Images must be an array." });
		}

		try {
			const featured = await Featured.findOneAndUpdate(
				{},
				{ images },
				{ upsert: true, new: true }
			);
			return res.status(200).json(featured);
		} catch (error) {
			return res
				.status(500)
				.json({ error: "Failed to update featured images." });
		}
	}
}
