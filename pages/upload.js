import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Folders from "../components/Folders";
import Videos from "../components/Videos";
import SelectFeaturedImages from "components/Featured";
import Head from "next/head";

export default function UploadPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") {
			return;
		}
		const timeoutId = setTimeout(() => {
			if (status === "unauthenticated") {
				router.push("/login");
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [status, router]);

	if (status === "loading") {
		return (
			<div className="flex justify-center mt-10">
				<Spinner />
			</div>
		);
	}

	return (
		<Layout>
			<Head>
				<title>olesinskiego | upload</title>
				<link rel="shortcut icon" href="/images/icon.png" type="image/x-icon" />
				<meta
					name="description"
					content="Owner of a fashion brand with extensive knowledge of image and style. Successfully completed numerous projects combining creativity with commercial success.
Creates advertising materials, individual photo sessions, social media content, and much more in a unique style."
				/>
			</Head>
			<SelectFeaturedImages />
			<Folders />
			<Videos />
		</Layout>
	);
}
