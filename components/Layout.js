import ReactLenis from "@studio-freight/react-lenis";
import Header from "./Header";
import Backdrop from "./Backdrop";
import { AnimatePresence } from "framer-motion";

export default function Layout({ children, modal, handleClose }) {
	return (
		<ReactLenis
			root
			options={{
				lerp: 0.1,
				smoothWheel: true,
				smoothTouch: true,
			}}
		>
			<Header />
			<AnimatePresence>
				{modal && <Backdrop handleClose={handleClose}>{modal}</Backdrop>}
			</AnimatePresence>
			<div className="min-h-screen container mx-auto p-2 sm:p-5 pt-[68px] sm:pt-[100px]">
				{children}
			</div>
		</ReactLenis>
	);
}
