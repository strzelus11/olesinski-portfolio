import Link from "next/link";
import { useEffect, useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import HamburgerButton from "./HamburgerButton";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function Header() {
	const link = "transition-all delay-150 duration-500 hover:-translate-y-0.5";

	const [navOpen, setNavOpen] = useState(false);
	const session = useSession();

	useEffect(() => {
		if (navOpen) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
		return () => document.body.classList.remove("overflow-hidden");
	}, [navOpen]);

	return (
		<>
			<header className="fixed h-[70px] top-0 w-full hidden md:flex justify-between items-center px-10 bg-white z-50 text-2xl">
				<Link href={"/"} className={`bold ${link}`}>
					Jakub Olesiński
				</Link>
				<div className="flex items-center gap-7">
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
				</div>
				{session.status === "authenticated" && (
					<button
						onClick={() => {
							signOut();
							toast.success("You've been logged out!");
						}}
					>
						log out
					</button>
				)}
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
			<header className="fixed h-[60px] top-0 w-full flex md:hidden justify-between items-center pl-5 md:px-10 bg-white z-50 text-2xl">
				<Link href={"/"} className="font-bold">
					Jakub Olesiński
				</Link>
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
						className="fixed bg-white inset-0 w-full h-full flex justify-center items-center z-10"
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
							{session.status === "authenticated" && (
								<button onClick={signOut}>log out</button>
							)}
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
