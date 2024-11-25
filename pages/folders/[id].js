import Layout from "../../components/Layout";
import { mongooseConnect } from "../../lib/mongoose";
import { Folder } from "../../models/Folder";
import { motion } from "framer-motion";
import { fadeIn } from "../../motion";

export default function FolderPage({ folder }) {
	return (
		<Layout>
			<h1 className="text-4xl font-bold capitalize text-center mb-7">
				{folder.name}
			</h1>
			<div className="columns-2 sm:columns-3 gap-2 sm:gap-3">
				{folder.images.map((image, index) => (
					<motion.div
						key={folder._id}
                        className="w-full h-auto object-cover"
                        loading="lazy"
						variants={fadeIn("down", "spring", 0.1 * index, 1.5)}
						initial="hidden"
						animate="show"
					>
						<img className="w-full h-full object-cover" src={image} alt="" />
					</motion.div>
				))}
			</div>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	await mongooseConnect();
	const { id } = context.query;

	const folder = await Folder.findById(id);

	return {
		props: {
			folder: JSON.parse(JSON.stringify(folder)),
		},
	};
}
