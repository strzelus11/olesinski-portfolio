import Layout from "../components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn } from "../motion";
import { IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import Head from "next/head";

export default function ContactPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState(null);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (email !== "") {
			if (!regex.test(email)) {
				setEmailError(true);
			} else {
				setEmailError(false);
			}
		} else {
			setEmailError(null);
		}
	}, [email]);

	async function sendEmail() {
		if (email !== "" && message !== "" && !emailError) {
			setLoading(true);
			const emailPromise = fetch("/api/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: firstName + " " + lastName,
					email,
					message,
				}),
			}).then((response) => {
				if (response.ok) {
					return response.json().then((data) => {
						console.log("Email sent successfully:", data);
					});
				} else {
					return response.json().then((data) => {
						console.error("Error sending email:", data.error);
						throw new Error("Błąd przy wysyłaniu emaila");
					});
				}
			});

			await toast
				.promise(emailPromise, {
					loading: "Wysyłanie...",
					success: "Email wysłany pomyślnie!",
					error: "Błąd przy wysyłaniu emaila",
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			toast.error("Uzupełnij wszystkie pola.");
		}
	}
	return (
		<Layout>
			<Head>
				<title>olesinskiego | contact</title>
				<link rel="shortcut icon" href="/icon.png" type="image/x-icon" />
			</Head>
			<div className="flex flex-col sm:grid grid-cols-3 gap-5">
				<motion.div
					variants={fadeIn("right", "spring", 0.3, 1)}
					initial="hidden"
					whileInView="show"
					className="col-span-1"
				>
					<img src="/images/contact.png" alt="" />
				</motion.div>
				<motion.div
					variants={fadeIn("left", "spring", 0.5, 1)}
					initial="hidden"
					whileInView="show"
					className="col-span-2 p-3 flex flex-col justify-between"
				>
					<div>
						<h1 className="text-3xl font-semibold mb-5">Contact me</h1>
						<form
							onSubmit={sendEmail}
							className="flex flex-col sm:items-start gap-2 max-w-xl"
						>
							<label>Name:</label>
							<div className="w-full flex gap-2 items-center">
								<input
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									className="flex-1"
									type="text"
									placeholder="First name"
								/>
								<input
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									className="flex-1"
									type="text"
									placeholder="Last name"
								/>
							</div>
							<div className="w-full flex justify-between">
								<label>Email:</label>
								<AnimatePresence>
									{emailError !== null && (
										<ErrorMessage
											message={
												emailError
													? "Your email is invalid."
													: "Your email is correct!"
											}
											error={emailError}
										/>
									)}
								</AnimatePresence>
							</div>
							<input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type="email"
							/>
							<label>Message:</label>
							<textarea
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								className="min-h-[10rem]"
							></textarea>
							<button className="mt-3" type="submit">
								Submit
							</button>
						</form>
					</div>
					<motion.div
						variants={fadeIn("top", "spring", 0.7, 1)}
						initial="hidden"
						animate="show"
						className="mt-10 sm:mt-0 flex flex-col sm:flex-row justify-end gap-3 sm:gap-7 w-full text-black"
					>
						<div className="flex items-center gap-2">
							<FaPhone className="size-5" />
							<p>+48 733 844 534</p>
						</div>
						<div className="flex items-center gap-2">
							<IoMail className="size-5" />
							<a
								target="_blank"
								rel="noopener noreferrer"
								href="mailto:kubaolesinski17@gmail.com"
								className="link"
							>
								kubaolesinski17@gmail.com
							</a>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</Layout>
	);
}
