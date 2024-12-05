import { mongooseConnect } from "../../lib/mongoose";
import { Video } from "../../models/Video";

export default async function handle(req, res) {
	const { method } = req;
	await mongooseConnect();

	if (method === "GET") {
		const videos = await Video.find().sort({ order: 1 });
		res.json(videos);
	}

	if (method === "POST") {
		const { link } = req.body;
		if (!link) {
			return res.status(400).json({ error: "Video link is required" });
		}

		const video = await Video.create({ link, thumbnail: "" });
		res.json(video);
	}

	if (method === "PUT") {
		const { _id, link, thumbnail } = req.body;

		if (!_id) {
			return res.status(400).json({
				error: "Invalid request: Video ID is required.",
			});
		}

		const updatedVideo = {};
		if (link) updatedVideo.link = link;
		if (thumbnail) updatedVideo.thumbnail = thumbnail;

		const video = await Video.updateOne({ _id }, updatedVideo);
		res.json(video);
	}
	if (method === "DELETE") {
		const { _id } = req.query;
		if (!_id) {
			return res.status(400).json({ error: "Video ID is required" });
		}
		await Video.deleteOne({ _id });
		res.json("ok");
	}
}
