import Layout from "../components/Layout";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../motion";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(null);

	const session = useSession();
	const router = useRouter();

	async function handleFormSubmit(e) {
		e.preventDefault();

		const loginPromise = new Promise(async (resolve, reject) => {
			const response = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (response.error) {
				reject(response.error);
			} else {
				resolve();
			}
		});

		await toast.promise(loginPromise, {
			loading: "Logging in...",
			success: "Logged in successfully!",
			error: "Invalid credentials. Try again.",
		});

		loginPromise.then(() => router.push("/upload"));
	}

	// async function register() {
	// 	const response = await axios.post("/api/register", {
	// 		email: "kubaolesinski17@gmail.com",
	// 		password: "olesinski69",
	// 	});
	// }

	return (
		<Layout>
			<div className="flex justify-center items-center h-full">
				<motion.form
					variants={fadeIn("down", "spring", 0, 1)}
					initial="hidden"
					whileInView="show"
					className="p-4 w-xl"
					onSubmit={handleFormSubmit}
				>
					<h3 className="text-3xl font-bold mb-2">Login</h3>
					<label>Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<label>Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button
						className="mt-3 w-full flex justify-center"
						type="submit"
						disabled={loading}
					>
						Login
					</button>
				</motion.form>
			</div>
		</Layout>
	);
}
