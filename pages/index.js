import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../motion";
import Spinner from "../components/Spinner";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ReactSortable } from "react-sortablejs";
import toast from "react-hot-toast";

export default function Home() {
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);

    const session = useSession();
    
	async function saveOrder(newOrder) {
		try {
			const response = await axios.post("/api/featured", {
				images: newOrder, // Send the reordered list
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
			.then((response) => setImages(response.data.images))
			.finally(() => setLoading(false));
	}, []);

	return (
		<Layout>
			{loading ? (
				<Spinner />
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
					className="columns-2 sm:columns-3 gap-2 sm:gap-3"
				>
					{session ? (
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
									className="mb-3 relative cursor-grab"
								>
									<img
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
								className="mb-3 relative"
							>
								<Image
									src={image}
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
	);
}
