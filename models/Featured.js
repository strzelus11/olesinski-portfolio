import { model, models, Schema } from "mongoose";

const FeaturedSchema = new Schema({
	images: [
		{
			url: { type: String, required: true },
			orientation: { type: String },
			width: { type: Number },
			height: { type: Number },
		},
	],
});

export const Featured = models?.Featured || model("Featured", FeaturedSchema);
