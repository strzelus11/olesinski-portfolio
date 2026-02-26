import "../styles/globals.css";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const GA_ID = "G-4GXLLCQ15Y";

export default function App({ Component, pageProps }) {
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url) => {
			if (typeof window.gtag !== "function") return;
			window.gtag("config", GA_ID, {
				page_path: url,
			});
		};

		router.events.on("routeChangeComplete", handleRouteChange);
		return () => router.events.off("routeChangeComplete", handleRouteChange);
	}, [router.events]);

	return (
		<>
			<script
				async
				src="https://www.googletagmanager.com/gtag/js?id=G-4GXLLCQ15Y"
			></script>
			<script>
				dangerouslySetInnerHTML=
				{{
					__html: `
                window.dataLayer = window.dataLayer || []; function gtag()
				{dataLayer.push(arguments);}
                gtag('js', new Date()); gtag('config', 'G-4GXLLCQ15Y', { page_path: window.location.pathname });
                `,
				}}
			</script>
			<SessionProvider>
				<Toaster
					position="top-center"
					reverseOrder={false}
					gutter={8}
					toastOptions={{
						duration: 3000,
						style: {
							borderRadius: "5px",
							fontSize: "20px",
							padding: "8px 16px",
							display: "inline-flex",
							justifyContent: "space-between",
							alignItems: "center",
							whiteSpace: "nowrap",
						},
					}}
				/>
				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
}
