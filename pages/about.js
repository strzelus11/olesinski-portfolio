import Layout from "../components/Layout";
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../motion";

export default function AboutPage() {
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
					className="col-span-2 p-3 max-w-xl"
				>
					<h1 className="text-3xl font-semibold mb-5">About me</h1>
					<p>
						Hej, Jestem Kuba i witam Ciebie na stronie poświęconej mojej
						fotograficznej twórczości fotografią zajmuje się parę lat, od 3
						większość czasu poświęcam fotografii modowej / produktowej dzięki
						pasji do podróży, również zdarza mi się robić fotki bardziej
						związane z architekturą/ krajobrazami i wszystkim co związane z
						podróżami od niedawna zacząłem zbierać najlepsze złapane ujęcia w
						jednym miejscu, czego efektem jest właśnie ta strona zapraszam do
						kontaktu, stwórzmy coś razem
					</p>
				</motion.div>
			</div>
		</Layout>
	);
}
