import Layout from "../../components/Layout";
import axios from "axios";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "../../motion";
import { ReactSortable } from "react-sortablejs";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Spinner from "components/Spinner";
import useIsMobile from "lib/useIsMobile";

export default function FolderPage({ folderId }) {
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [folder, setFolder] = useState({});

	const session = useSession();
	const isMobile = useIsMobile();

	useEffect(() => {
		setLoading(true);
		const fetchFolderAndDimensions = async () => {
			try {
				const response = await axios.get(`/api/folders/?_id=${folderId}`);
				const folderData = response.data;
                setFolder(folderData);

				if (folderData?.images?.length) {
					const results = await Promise.all(
                        folderData.images.map((image) => {
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
				}
			} catch (error) {
				console.error("Error fetching folder data:", error);
				toast.error("Failed to load folder data.");
			} finally {
				setLoading(false);
			}
		};

		fetchFolderAndDimensions();
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
		<Layout>
			<h1 className="text-3xl md:text-4xl font-bold capitalize text-center mb-5 sm:mb-7">
				{folder.name}
			</h1>
			<div
				className={
					session.status !== "authenticated" && isMobile
						? "grid grid-cols-2 gap-x-2 sm:gap-x-3"
						: ""
				}
			>
				{loading ? (
					<Spinner />
				) : session.status === "authenticated" ? (
					<ReactSortable
						className="grid grid-cols-2 gap-x-2 sm:gap-x-3"
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
									src={image.url}
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
							className={`mb-2 sm:mb-3 relative w-full ${
								image.orientation === "horizontal" ? "col-span-2" : "col-span-1"
							}`}
						>
							<NextImage
								src={image.url}
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
