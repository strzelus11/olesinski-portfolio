import { mongooseConnect } from "../../lib/mongoose";
import { User } from "@/models/User";

export default async function handle(req, res) {
	const { method } = req;
	await mongooseConnect();

	if (method === "GET") {
		if (req.query?.id) {
			res.json(await User.findOne({ _id: req.query.id }));
		} else {
			res.json(await User.find());
		}
	}
}
