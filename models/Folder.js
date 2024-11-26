import { model, models, Schema } from "mongoose";

const FolderSchema = new Schema({
	name: { type: String, required: true, unique: true },
	images: { type: [String], default: [] },
	order: { type: Number },
});

export const Folder = models?.Folder || model("Folder", FolderSchema);
