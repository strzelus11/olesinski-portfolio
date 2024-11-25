// import EmailTemplate from "../components/email-template";
// import { Resend } from "resend";

// const resend = new Resend(process.env.API_KEY);

// export default async function handle(req, res) {
// 	if (req.method !== "POST") {
// 		res.status(405).json({ error: "Method not allowed" });
// 		return;
// 	}

// 	const { name, email, message, course } = req.body;

// 	if (!name || !email) {
// 		res.status(400).json({ error: "Name and email are required" });
// 		return;
// 	}

// 	try {
// 		const { data, error } = await resend.emails.send({
// 			from: `${name} <onboarding@resend.dev>`,
// 			to: "kubaolesinski17@gmail.com",
// 			subject: course || "Korepetycje",
// 			react: EmailTemplate({
// 				name: name,
// 				email: email,
// 				message: message || "No message",
// 			}),
//         });

// 		if (error) {
// 			res.status(400).json({ error });
// 			return;
// 		}

// 		res.status(200).json({ success: true, data });
// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 	}
// }
