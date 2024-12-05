import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../motion";
import Spinner from "../components/Spinner";
import Image from "next/image";

export default function Home() {
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		axios.get("/api/images").then((response) => setImages(response.data));
		setLoading(false);
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
					{images?.map((image, index) => (
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
					))}
				</motion.div>
			)}
		</Layout>
	);
}
