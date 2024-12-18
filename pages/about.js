import Layout from "../components/Layout";
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../motion";
import Head from "next/head";
import Image from "next/image";

export default function AboutPage() {
	return (
		<Layout>
			<Head>
				<title>olesinskiego | about</title>
				<link rel="shortcut icon" href="/images/icon.png" type="image/x-icon" />
				<meta
					name="description"
					content="Owner of a fashion brand with extensive knowledge of image and style. Successfully completed numerous projects combining creativity with commercial success.
Creates advertising materials, individual photo sessions, social media content, and much more in a unique style."
				/>
			</Head>
			<div className="flex flex-col sm:grid grid-cols-3 gap-5">
				<motion.div
					variants={fadeIn("right", "spring", 0.3, 1)}
					initial="hidden"
					whileInView="show"
					className="col-span-1"
				>
					<Image
						src="/images/about.png"
						alt="about"
						width={500}
						height={0}
						className="rounded-md object-cover"
						loading="lazy"
					/>
				</motion.div>
				<motion.div
					variants={fadeIn("left", "spring", 0.5, 1)}
					initial="hidden"
					whileInView="show"
					className="col-span-2 p-3 max-w-xl"
				>
					<h1 className="text-3xl font-semibold mb-5">About me</h1>
					<div className="flex flex-col gap-3">
						<p>
							Hej, <br /> Jestem Kuba i witam Ciebie na stronie poświęconej
							mojej fotograficznej twórczości
						</p>
						<p>
							fotografią zajmuje się parę lat, od 3 większość czasu poświęcam
							fotografii modowej / produktowej
						</p>
						<p>
							dzięki pasji do podróży, również zdarza mi się robić fotki
							bardziej związane z architekturą/ krajobrazami i wszystkim co
							związane z podróżami
						</p>
						<p>
							od niedawna zacząłem zbierać najlepsze złapane ujęcia w jednym
							miejscu, czego efektem jest właśnie ta strona
						</p>
						<p>zapraszam do kontaktu, stwórzmy coś razem :)</p>
					</div>
				</motion.div>
			</div>
		</Layout>
	);
}
