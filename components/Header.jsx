import Link from "next/link";
import { useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import HamburgerButton from "./HamburgerButton";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
	const link = "transition-all delay-150 duration-500 hover:-translate-y-0.5";
	const scrollToSection = (id) => {
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
	};

	const [navOpen, setNavOpen] = useState(false);

	return (
		<>
			<header className="fixed h-[80px] top-0 w-full hidden sm:flex justify-between items-center px-10 bg-white z-50 text-2xl">
				<div className="font-bold">Jakub Olesiński</div>
				<div className="flex items-center gap-7">
					<Link href="/" className={link}>
						photo
					</Link>
					<Link href="/video" className={link}>
						video
					</Link>
					<Link href="/about" className={link}>
						about
					</Link>
					<Link href="/contact" className={link}>
						contact
					</Link>
				</div>
				<div className="flex items-center gap-7">
					<Link
						className={link}
						href="https://www.instagram.com/olesinskiego/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FaInstagram />
					</Link>
					<Link
						className={link}
						href="https://www.tiktok.com/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FaTiktok />
					</Link>
				</div>
			</header>
			<header className="fixed h-[60px] top-0 w-full flex sm:hidden justify-between items-center pl-5 sm:px-10 bg-white z-50 text-2xl">
				<div className="font-bold">Jakub Olesiński</div>
				<div className="scale-[0.6]">
					<HamburgerButton active={navOpen} setActive={setNavOpen} />
				</div>
			</header>
			<AnimatePresence>
				{navOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 0.5,
							ease: "easeInOut",
						}}
						className="fixed bg-white inset-0 w-full h-full flex justify-center items-center"
					>
						<div className="flex flex-col justify-center items-center gap-5 scale-[2]">
							<Link href="/photo" className={link}>
								photo
							</Link>
							<Link href="/video" className={link}>
								video
							</Link>
							<Link href="/about" className={link}>
								about
							</Link>
							<Link href="/contact" className={link}>
								contact
							</Link>
							<div className="flex items-center gap-7 mt-7">
								<Link
									className={link}
									href="https://www.instagram.com/olesinskiego/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<FaInstagram />
								</Link>
								<Link
									className={link}
									href="https://www.tiktok.com/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<FaTiktok />
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
