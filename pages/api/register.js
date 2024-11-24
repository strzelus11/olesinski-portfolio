import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import toast from "react-hot-toast";

export default async function handle(req, res) {
	if (req.method === "POST") {
		await mongooseConnect();

		const { email, password } = req.body;

		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		try {
			const user = await User.create({ email, password: hashedPassword });
			res.json(user);
			toast.success("Registered");
		} catch (error) {
			if (error.code === 11000 && error.keyValue.email) {
				res.status(409).json({ error: "Email address already exists" });
			} else {
				res.status(500).json({ error: "Unexpected error occurred" });
			}
		}
		res.json(true);
	}
}
