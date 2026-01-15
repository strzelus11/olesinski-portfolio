import mongoose from "mongoose";
const { model, models, Schema } = mongoose;

const FolderSchema = new Schema({
	name: { type: String, required: true, unique: true },
	slug: { type: String, required: true, unique: true, index: true },
	images: { type: [String], default: [] },
	order: { type: Number },
	coverImage: { type: String, default: null },
});

export const Folder = models?.Folder || model("Folder", FolderSchema);
