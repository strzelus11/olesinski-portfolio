import { model, models, Schema } from "mongoose";

const FeaturedSchema = new Schema({
	images: {
		type: [String],
		required: true,
		default: [],
	},
});

export const Featured = models?.Featured || model("Featured", FeaturedSchema);
