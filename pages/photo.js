import Layout from "../components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../motion";
import Link from "next/link";
import Head from "next/head";

export default function PhotoPage() {
	const [folders, setFolders] = useState([]);

	useEffect(() => {
		axios.get("/api/folders").then((response) => setFolders(response.data));
	}, []);
	return (
		<Layout>
			<Head>
				<title>olesinskiego | photo</title>
				<link rel="shortcut icon" href="/images/icon.png" type="image/x-icon" />
				<meta
					name="description"
					content="Owner of a fashion brand with extensive knowledge of image and style. Successfully completed numerous projects combining creativity with commercial success.
Creates advertising materials, individual photo sessions, social media content, and much more in a unique style."
				/>
			</Head>
			<motion.div className="flex justify-center">
				<div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
					className="w-full flex flex-col gap-2 sm:gap-5 lg:grid grid-cols-2"
				>
					{folders.map((folder, index) => (
						<motion.div
							key={folder._id}
							className="w-full aspect-[3/2] rounded overflow-hidden cursor-pointer relative group"
							variants={fadeIn("down", "spring", 0.1 * index, 1.5)}
							initial="hidden"
							animate="show"
							whileHover={{
								scale: 1.01,
							}}
							transition={{
								ease: "easeInOut",
								duration: 0.5,
							}}
						>
							<img
								className="w-full h-full object-cover"
								src={folder.images[0]}
								alt=""
							/>
							<div className="absolute inset-0 bg-black/60 sm:opacity-0 transition-all duration-500 delay-150 group-hover:opacity-100 flex justify-center items-center">
								<Link
									className="text-4xl medium text-white folder-link"
									href={`/folders/${folder._id}`}
								>
									{folder.name}
								</Link>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>
		</Layout>
	);
}
