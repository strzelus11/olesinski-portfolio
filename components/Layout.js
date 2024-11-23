import ReactLenis from "@studio-freight/react-lenis";
import Header from "./Header";


export default function Layout({ children }) {
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
			<div className="min-h-screen container mx-auto p-2 sm:p-5 pt-[68px] sm:pt-[100px]">
				{children}
			</div>
		</ReactLenis>
	);
}
