import Layout from "../components/Layout";
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/motion";

export default function AboutPage() {
	return (
		<Layout>
			<div className="flex flex-col sm:grid grid-cols-3 gap-5">
				<motion.div
					variants={fadeIn("right", "spring", 0.3, 1)}
					initial="hidden"
					whileInView="show"
					className="col-span-1"
				>
					<img src="/images/1.png" alt="" />
				</motion.div>
				<motion.div
					variants={fadeIn("left", "spring", 0.5, 1)}
					initial="hidden"
					whileInView="show"
                    className="col-span-2 p-3 max-w-xl"
				>
					<h1 className="text-3xl font-semibold mb-5">About me</h1>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, quibusdam sed et, explicabo, deleniti inventore sunt aperiam fugiat ipsa illo distinctio laborum adipisci similique quasi rerum magnam accusamus amet. Praesentium, quod laboriosam. Animi corporis tenetur molestiae adipisci, consectetur excepturi repudiandae, exercitationem accusantium ea sed distinctio inventore? Saepe dolores sed, quos officiis corrupti voluptas sunt. Reiciendis veritatis error alias aut ut aliquid nemo, expedita illo facilis dignissimos aperiam commodi sit a quos dolor consequatur explicabo est? Quibusdam eligendi nihil doloribus, eveniet hic odit facere numquam delectus magni quae sapiente dicta ullam rerum velit facilis repellendus amet, accusantium debitis saepe provident illo.
					</p>
				</motion.div>
			</div>
		</Layout>
	);
}
