import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Folders from "../components/Folders";
import Videos from "../components/Videos";

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
			<Folders />
			<Videos />
		</Layout>
	);
}
