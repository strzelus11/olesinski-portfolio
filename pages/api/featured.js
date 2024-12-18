import { mongooseConnect } from "lib/mongoose";
import { Featured } from "../../models/Featured";
import sizeOf from "image-size";
import axios from "axios";

export default async function handle(req, res) {
	const { method } = req;
	await mongooseConnect();

	if (method === "GET") {
		try {
			const featured = await Featured.findOne();
			const images = featured?.images || [];
			return res.status(200).json({ images });
		} catch (error) {
			console.error("Error fetching featured images:", error);
			return res
				.status(500)
				.json({ error: "Failed to fetch featured images." });
		}
	}

	if (method === "POST") {
		const { images } = req.body;

		if (!Array.isArray(images)) {
			return res.status(400).json({ error: "Images must be an array." });
		}

		try {
			const imagesWithDimensions = await Promise.all(
				images.map(async (imageUrl) => {
					try {
						const imageBuffer = await axios.get(imageUrl.url, {
							responseType: "arraybuffer",
						});
						const dimensions = sizeOf(imageBuffer.data);
						return {
							url: imageUrl.url,
							width: dimensions.width,
							height: dimensions.height,
						};
					} catch (error) {
						console.error(
							"Error fetching image or calculating dimensions:",
							error
						);
						return { url: imageUrl.url, width: 500, height: 500 };
					}
				})
			);
			const featured = await Featured.findOneAndUpdate(
				{},
				{ images: imagesWithDimensions },
				{ upsert: true, new: true }
			);

			return res.status(200).json(featured);
		} catch (error) {
			console.error("Error updating featured images:", error);
			return res
				.status(500)
				.json({ error: "Failed to update featured images." });
		}
	}
}
