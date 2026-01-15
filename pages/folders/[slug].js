import Layout from "../../components/Layout";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn } from "../../motion";
import { ReactSortable } from "react-sortablejs";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Spinner from "components/Spinner";
import ImageBackdrop from "components/ImageBackdrop";
import Head from "next/head";

export default function FolderPage({ slug }) {
	const [images, setImages] = useState([]);
	const [fullImage, setFullImage] = useState(null);
	const [folder, setFolder] = useState({});
	const [loading, setLoading] = useState(true);

	const session = useSession();

	useEffect(() => {
		let cancelled = false;

		(async () => {
			setLoading(true);
			try {
				// API supports slug lookup (api is assumed updated)
				const response = await axios.get(`/api/folders`, {
					params: { slug },
				});
				if (cancelled) return;
				setImages(response.data?.images || []);
				setFolder(response.data || {});
			} catch (error) {
				console.error("Error fetching folder data:", error);
				if (!cancelled) toast.error("Failed to load folder data.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [slug]);

	async function saveOrder(newOrder) {
		if (!folder?._id) return;
		try {
			const response = await axios.put(`/api/folders`, {
				_id: folder?._id,
				images: newOrder,
			});
			if (response.status === 200) {
				toast.success("Folder images reordered!");
			} else {
				toast.error("Failed to save the order.");
			}
		} catch (error) {
			console.error("Error saving order:", error);
			toast.error("An error occurred while saving the order.");
		}
	}

	return (
		<>
			<Head>
				<title>olesinskiego | {folder.name}</title>
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
							className="max-h-[90dvh] w-auto h-auto object-contain rounded-lg"
							src={fullImage}
							decoding="async"
						/>
					</ImageBackdrop>
				)}
			</AnimatePresence>
			<Layout>
				<h1 className="text-3xl sm:text-4xl medium capitalize text-center mb-5 sm:mb-7">
					{folder.name}
				</h1>
				<div className="sm:columns-1 lg:columns-3 gap-3">
					{loading ? (
						<Spinner />
					) : session.status === "authenticated" ? (
						<ReactSortable
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
									className="mb-2 sm:mb-3 relative cursor-grab"
								>
									<img
										onClick={() => setFullImage(image)}
										src={image}
										className="w-full h-auto rounded-md"
										alt=""
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
								className="mb-2 sm:mb-3 relative"
							>
								<img
									onClick={() => setFullImage(image)}
									src={image}
									alt={`Image ${index + 1}`}
									className="w-full h-auto rounded-md object-cover cursor-zoom-in"
									loading={index < 2 ? "eager" : "lazy"}
									decoding="async"
								/>
							</motion.div>
						))
					)}
				</div>
			</Layout>
		</>
	);
}

export async function getServerSideProps(context) {
	const { slug } = context.params;

	return {
		props: {
			slug,
		},
	};
}
