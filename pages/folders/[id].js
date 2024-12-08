import Layout from "../../components/Layout";
import axios from "axios";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn } from "../../motion";
import { ReactSortable } from "react-sortablejs";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Spinner from "components/Spinner";
import ImageBackdrop from "components/ImageBackdrop";

export default function FolderPage({ folderId }) {
	const [images, setImages] = useState([]);
	const [fullImage, setFullImage] = useState(null);
	const [folder, setFolder] = useState({});
	const [loading, setLoading] = useState(true);

	const session = useSession();

	useEffect(() => {
		setLoading(true);
		try {
			axios.get(`/api/folders/?_id=${folderId}`).then((response) => {
				setImages(response.data?.images || []);
				setFolder(response.data);
			});
		} catch (error) {
			console.error("Error fetching folder data:", error);
			toast.error("Failed to load folder data.");
		} finally {
			setLoading(false);
		}
	}, [folderId]);

	async function saveOrder(newOrder) {
		try {
			const response = await axios.put(`/api/folders`, {
				_id: folderId,
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
			<AnimatePresence>
				{fullImage !== null && (
					<ImageBackdrop
						handleClose={() => setFullImage(null)}
					>
						<img
							className="max-h-[90vh] w-full object-cover rounded-lg"
							src={fullImage}
						/>
					</ImageBackdrop>
				)}
			</AnimatePresence>
			<Layout>
				<h1 className="text-4xl medium capitalize text-center mb-7">
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
										className="sm:w-full h-full rounded-md"
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
								className="mb-2 sm:mb-3 relative"
							>
								<Image
									onClick={() => setFullImage(image)}
									src={image}
									alt={`Image ${index + 1}`}
									width={500}
									height={0}
									className="rounded-md object-cover"
									priority={index < 2}
									unoptimized
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
	const { id: folderId } = context.params;

	return {
		props: {
			folderId,
		},
	};
}
