import { model, models, Schema } from "mongoose";

const VideoSchema = new Schema({
	link: { type: String, required: true, unique: true },
	thumbnail: { type: String },
	order: { type: Number },
});

export const Video = models?.Video || model("Video", VideoSchema);
