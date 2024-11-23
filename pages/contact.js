import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { fadeIn } from "@/motion";
import { IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";

export default function ContactPage() {
	return (
		<Layout>
			<div className="flex flex-col sm:grid grid-cols-3 gap-5">
				<motion.div
					variants={fadeIn("right", "spring", 0.3, 1)}
					initial="hidden"
					whileInView="show"
					className="col-span-1"
				>
					<img src="/images/1.png" alt="" />
				</motion.div>
				<motion.div
					variants={fadeIn("left", "spring", 0.5, 1)}
					initial="hidden"
					whileInView="show"
					className="col-span-2 p-3 flex flex-col justify-between"
				>
					<div>
						<h1 className="text-3xl font-semibold mb-5">Contact me</h1>
						<form className="flex flex-col sm:items-start gap-2 max-w-xl">
							<label>Name:</label>
							<div className="w-full flex gap-2 items-center">
								<input
									className="flex-1"
									type="text"
									placeholder="First name"
								/>
								<input className="flex-1" type="text" placeholder="Last name" />
							</div>
							<label>Email:</label>
							<input type="email" />
							<label>Message:</label>
							<textarea className="min-h-[10rem]"></textarea>
							<button type="submit">Submit</button>
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
