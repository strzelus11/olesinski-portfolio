import { backInOut, motion } from "framer-motion";

export default function ImageBackdrop({ children, handleClose }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={handleClose}
			className="fixed inset-0 bg-black/60 flex items-center justify-center p-5 z-[100]"
		>
			<motion.div
				initial={{ opacity: 0, scale: 0, rotate: -20 }}
				animate={{ opacity: 1, scale: 1, rotate: 0 }}
				exit={{ opacity: 0, scale: 0, rotate: 20 }}
				transition={{ ease: backInOut, duration: 0.5 }}
				className="bg-white p-2 sm:p-5 rounded-md relative aspect-auto flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={handleClose}
					className="hover:scale-100 absolute bg-white p-1 rounded-full -top-3 -left-3"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="size-4"
					>
						<path
							fillRule="evenodd"
							d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
				{children}
			</motion.div>
		</motion.div>
	);
}
