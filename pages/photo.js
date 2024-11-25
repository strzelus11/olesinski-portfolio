import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../motion";
import Link from "next/link";

export default function PhotoPage() {
	const [folders, setFolders] = useState([]);

	useEffect(() => {
		axios.get("/api/folders").then((response) => setFolders(response.data));
	}, []);
	return (
		<Layout>
			<motion.div className="flex justify-center">
				<div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
					className="w-full flex flex-col gap-5 lg:grid grid-cols-2"
				>
					{folders.map((folder, index) => (
						<motion.div
							key={folder._id}
							className="w-full lg:max-w-[40rem] h-[15rem] sm:h-[20rem] rounded overflow-hidden cursor-pointer relative group"
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
							<div className="absolute inset-0 bg-black/60 opacity-0 transition-all duration-500 delay-150 group-hover:opacity-100 flex justify-center items-center">
								<Link
									className="text-4xl font-bold text-white folder-link"
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
