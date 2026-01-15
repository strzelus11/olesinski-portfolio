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
					className="col-span-1 sm:pt-[58px]"
				>
					<Image
						src="/images/about.webp"
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
					className="col-span-2 px-3 max-w-3xl"
				>
					<h1 className="text-3xl font-semibold mb-6">About me</h1>

					<div className="flex flex-col gap-3 text-base leading-relaxed text-gray-800">
						<p className="text-lg font-medium">
							Cześć, jestem Kuba.
						</p>

						<p>
							Fotografia jest częścią mojego życia od wielu lat, a od ponad pięciu stanowi
							główny obszar mojej pracy twórczej. Najwięcej czasu poświęcam fotografii modowej,
							gdzie kluczowe są dla mnie estetyka, światło i świadome budowanie klimatu obrazu.
						</p>


						<p>
							Równolegle realizuję fotografie ślubne, skupiając się na prawdziwych emocjach i
							naturalnych momentach. Wybieram tu rolę obserwatora — szukam historii, które
							dzieją się organicznie, bez reżyserii i zbędnej ingerencji.
						</p>


						<p>
							W podróżach odnajduję dodatkową przestrzeń do obserwacji. Fotografuję miejsca
							oraz spotkanych po drodze ludzi — często są to przypadkowe kadry, detale i
							sytuacje, które przyciągają uwagę swoim charakterem. To właśnie z tych
							obserwacji wywodzi się mój styl i sposób, w jaki opowiadam historie obrazem.
						</p>

						<p className="pt-2 font-medium">
							Jeśli czujesz, że mój styl jest bliski Twojej wizji — zapraszam do kontaktu.
							Stwórzmy coś razem.
						</p>
					</div>
				</motion.div>
			</div>
		</Layout>
	);
}
