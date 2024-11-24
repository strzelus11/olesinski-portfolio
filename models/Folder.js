import { model, models, Schema } from "mongoose";

const FolderSchema = new Schema({
	name: { type: String, required: true, unique: true },
	images: { type: [String], default: [] },
});

export const Folder = models?.Folder || model("Folder", FolderSchema);
