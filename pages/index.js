import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../motion";

export default function Home() {
	const [images, setImages] = useState([]);

	useEffect(() => {
		axios.get("/api/images").then((response) => setImages(response.data));
	}, []);
	return (
		<Layout>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1 }}
				className="columns-2 sm:columns-3 gap-2 sm:gap-3"
			>
				{images?.map((image, index) => (
					<div key={index} className="mb-3">
						<motion.img
							src={image}
							className="w-full h-auto object-cover"
							loading="lazy"
							variants={fadeIn("down", "spring", 0.03 * index, 1.5)}
							initial="hidden"
							animate="show"
						/>
					</div>
				))}
			</motion.div>
		</Layout>
	);
}
