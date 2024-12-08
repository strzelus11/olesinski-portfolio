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

export default function Home() {
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [fullImage, setFullImage] = useState(null);

	const session = useSession();
	const isMobile = useIsMobile();

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
		setLoading(true);
		axios
			.get("/api/featured")
			.then((response) => {
				const fetchDimensions = async (images) => {
					const results = await Promise.all(
						images.map((image) => {
							return new Promise((resolve) => {
								const img = new Image();
								img.src = image.url;
								img.onload = () => {
									resolve({
										url: image.url,
										width: img.naturalWidth,
										height: img.naturalHeight,
										orientation:
											img.naturalWidth > img.naturalHeight
												? "horizontal"
												: "vertical",
									});
								};
							});
						})
					);
					setImages(results);
				};

				fetchDimensions(response.data.images || []);
			})
			.finally(() => setLoading(false));
	}, []);

	return (
		<>
			<AnimatePresence>
				{fullImage !== null && (
					<ImageBackdrop handleClose={() => setFullImage(null)}>
                        <img className="max-h-[90vh] w-full object-cover rounded-lg" src={fullImage.url} />
					</ImageBackdrop>
				)}
			</AnimatePresence>
			<Layout>
				{loading ? (
					<Spinner />
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1 }}
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
										/>
									</motion.div>
								))}
							</ReactSortable>
						) : (
							images.map((image, index) => (
								<motion.div
									key={index}
									variants={fadeIn("down", "spring", 0.1 * index, 1.5)}
									initial="hidden"
									animate="show"
									className={`mb-2 sm:mb-3 relative ${
										image.orientation === "horizontal"
											? "col-span-2"
											: "col-span-1"
									}`}
								>
									<NextImage
										src={image.url}
										alt={index}
										width={500}
										height={0}
										className="rounded-md object-cover"
										priority={index < 2}
										unoptimized
									/>
								</motion.div>
							))
						)}
					</motion.div>
				)}
			</Layout>
		</>
	);
}
