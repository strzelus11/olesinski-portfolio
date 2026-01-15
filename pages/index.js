import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn } from "../motion";
import Spinner from "../components/Spinner";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import { ReactSortable } from "react-sortablejs";
import toast from "react-hot-toast";
import useIsMobile from "lib/useIsMobile";
import ImageBackdrop from "components/ImageBackdrop";
import Head from "next/head";

export default function Home() {
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [fullImage, setFullImage] = useState(null);

	const session = useSession();
	const isMobile = useIsMobile();

	const SKELETON_COUNT = 12;

	function GallerySkeleton() {
		const containerClass =
			session.status !== "authenticated"
				? isMobile
					? "grid grid-cols-2 gap-x-2 sm:gap-x-3"
					: "md:columns-2 lg:columns-3"
				: isMobile
					? "grid grid-cols-2 gap-x-2 sm:gap-x-3"
					: "md:columns-2 lg:columns-3";

		return (
			<div className={containerClass} aria-busy="true" aria-label="Loading gallery">
				{Array.from({ length: SKELETON_COUNT }).map((_, i) => {
					const tall = i % 3 === 0;
					return (
						<div
							key={i}
							className={`mb-2 sm:mb-3 rounded-md bg-gray-200/60 animate-pulse ${
								tall ? "h-72" : "h-48"
							}`}
						/>
					);
				})}
			</div>
		);
	}

	async function saveOrder(newOrder) {
		try {
			const response = await axios.post("/api/featured", {
				images: newOrder,
			});

			if (response.status === 200) {
				toast.success("Featured images reordered!");
			} else {
				toast.error("Something went wrong.");
			}
		} catch (error) {
			console.error("Error saving image order:", error);
			toast.error("Failed to save image order.");
		}
	}

	useEffect(() => {
		let cancelled = false;

		(async () => {
			setLoading(true);
			try {
				const response = await axios.get("/api/featured");
				if (cancelled) return;
				setImages(response.data.images || []);
			} catch (error) {
				console.error("Failed to fetch images:", error);
				if (!cancelled) toast.error("Failed to load gallery.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<>
			<Head>
				<title>olesinskiego | home</title>
				<link rel="shortcut icon" href="/images/icon.png" type="image/x-icon" />
				<meta
					name="description"
					content="Owner of a fashion brand with extensive knowledge of image and style. Successfully completed numerous projects combining creativity with commercial success.
Creates advertising materials, individual photo sessions, social media content, and much more in a unique style."
				/>
			</Head>
			<AnimatePresence>
				{fullImage !== null && (
					<ImageBackdrop handleClose={() => setFullImage(null)}>
						<img
							className="max-h-[90vh] w-full object-cover rounded-lg"
							src={fullImage.url}
						/>
					</ImageBackdrop>
				)}
			</AnimatePresence>
			<Layout>
				{loading ? (
					<GallerySkeleton />
				) : (
					<div
						className={
							session.status !== "authenticated"
								? isMobile
									? "grid grid-cols-2 gap-x-2 sm:gap-x-3"
									: "md:columns-2 lg:columns-3"
								: ""
						}
					>
						{session.status === "authenticated" ? (
							<ReactSortable
								className={
									isMobile
										? "grid grid-cols-2 gap-x-2 sm:gap-x-3"
										: "md:columns-2 lg:columns-3"
								}
								list={images}
								setList={setImages}
								onEnd={(evt) => {
									const newOrder = [...images];
									const [movedItem] = newOrder.splice(evt.oldIndex, 1);
									newOrder.splice(evt.newIndex, 0, movedItem);
									setImages(newOrder);
									saveOrder(newOrder);
								}}
								animation={500}
							>
								{images.map((image, index) => (
									<motion.div
										key={index}
										variants={fadeIn("down", "spring", 0.1 * index, 1.5)}
										initial="hidden"
										animate="show"
										className={`mb-2 sm:mb-3 relative w-full ${
											image.orientation === "horizontal"
												? "col-span-2"
												: "col-span-1"
										}`}
									>
										<img
											onClick={() => setFullImage(image)}
											src={image.url}
											className="w-full h-auto rounded-md cursor-grab"
											alt=""
											loading={index < 4 ? "eager" : "lazy"}
											decoding="async"
										/>
									</motion.div>
								))}
							</ReactSortable>
						) : (
							images.map((image, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0 }}
									animate={{ opacity: 100 }}
									transition={{
										duration: 0.5,
										ease: "easeInOut",
									}}
									className={`mb-2 sm:mb-3 relative ${
										image.orientation === "horizontal"
											? "col-span-2"
											: "col-span-1"
									}`}
								>
									<NextImage
										onClick={() => setFullImage(image)}
										src={image.url}
										alt={"Featured photo"}
										width={image.width || 500}
										height={
											image.height ||
											(image.orientation === "horizontal" ? 333 : 750)
										}
										sizes={
											isMobile
												? "50vw"
												: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
										}
										priority={index < 2}
										className="rounded-md object-cover cursor-zoom-in"
										loading={index < 2 ? "eager" : "lazy"}
									/>
								</motion.div>
							))
						)}
					</div>
				)}
			</Layout>
		</>
	);
}
