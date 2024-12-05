import Layout from "../../components/Layout";
import { mongooseConnect } from "../../lib/mongoose";
import { Folder } from "../../models/Folder";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "../../motion";

export default function FolderPage({ folder }) {
	return (
		<Layout>
			<h1 className="text-4xl font-bold capitalize text-center mb-7">
				{folder.name}
			</h1>
			<div className="sm:columns-1 lg:columns-3 gap-3">
				{folder.images.map((image, index) => (
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
			</div>
		</Layout>
	);
}

export async function getStaticProps(context) {
	await mongooseConnect();
	const { id } = context.params;

	const folder = await Folder.findById(id);

	return {
		props: {
			folder: JSON.parse(JSON.stringify(folder)),
		},
		revalidate: 60,
	};
}

export async function getStaticPaths() {
	await mongooseConnect();
	const folders = await Folder.find();

	const paths = folders.map((folder) => ({
		params: { id: folder._id.toString() },
	}));

	return { paths, fallback: "blocking" };
}
