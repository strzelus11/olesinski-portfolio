import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { fadeIn } from "../motion";
import Head from "next/head";

export default function VideoPage() {
	const [videos, setVideos] = useState([]);
	const [open, setOpen] = useState(false);
	const [activeVideo, setActiveVideo] = useState(null);

	function embed(watchUrl) {
		const url = new URL(watchUrl);
		const videoId = url.searchParams.get("v");
		return `https://www.youtube.com/embed/${videoId}`;
	}

	useEffect(() => {
		axios.get("/api/videos").then((response) => setVideos(response.data));
	}, []);

	return (
		<Layout
			handleClose={() => {
				setOpen(false);
				setActiveVideo(null);
			}}
			modal={
				open &&
				activeVideo && (
					<iframe
						className="aspect-video w-full h-full"
						src={embed(activeVideo)}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					></iframe>
				)
			}
		>
			<Head>
				<title>olesinskiego | video</title>
				<link rel="shortcut icon" href="/icon.png" type="image/x-icon" />
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
					className="w-full flex flex-col gap-5 lg:grid grid-cols-2"
				>
					{videos.map((video, index) => (
						<motion.div
							key={video.id}
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
								src={video.thumbnail}
							/>
							<div className="absolute inset-0 bg-black/60 sm:opacity-0 transition-all duration-500 delay-150 group-hover:opacity-100 flex justify-center items-center">
								<button
									onClick={() => {
										setOpen(true);
										setActiveVideo(video.link);
									}}
									className="text-white"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="size-12"
									>
										<path
											fillRule="evenodd"
											d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>
		</Layout>
	);
}
