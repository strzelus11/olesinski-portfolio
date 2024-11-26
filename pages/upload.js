import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ImageInput from "../components/ImageInput";
import { ReactSortable } from "react-sortablejs";
import toast from "react-hot-toast";

export default function UploadPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [folders, setFolders] = useState([]);
	const [newFolderName, setNewFolderName] = useState("");
	const [loading, setLoading] = useState(null);

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

	useEffect(() => {
		axios.get("/api/folders").then((response) => setFolders(response.data));
		setLoading(false);
	}, []);

	async function createFolder() {
		if (!newFolderName.trim()) return;
		const response = await axios.post("/api/folders", { name: newFolderName });
		setFolders([...folders, response.data]);
		setNewFolderName("");
	}

	async function deleteFolder(folderId) {
		await axios.delete(`/api/folders/?_id=${folderId}`);
		setFolders(folders.filter((folder) => folder._id !== folderId));
	}

	async function updateFolder(folderId, updatedImages) {
		try {
			await axios.put(`/api/folders`, { _id: folderId, images: updatedImages });
			setFolders(
				folders.map((folder) =>
					folder._id === folderId
						? { ...folder, images: updatedImages }
						: folder
				)
			);
		} catch (error) {
			console.error("Failed to update folder:", error);
		}
	}

	async function saveOrder(newOrder) {
		console.log(newOrder);
		try {
			const response = await axios.put("/api/reorder", {
				folders: newOrder,
			});

			if (response.status === 200) {
				// toast.success("Folders reordered successfully!");
			}
		} catch (error) {
			console.error("Error reordering folders:", error);
			toast.error("Failed to reorder folders.");
		}
	}

	if (status === "loading") {
		return <Spinner />;
	}

	return (
		<Layout>
			<form
				onSubmit={createFolder}
				className="mb-4 max-w-xl flex gap-2 items-center"
			>
				<input
					type="text"
					placeholder="New folder name"
					value={newFolderName}
					onChange={(e) => setNewFolderName(e.target.value)}
					className="border p-2 mb-0"
				/>
				<button
					type="submit"
					className="bg-gray-500 text-white px-4 py-2 rounded-sm whitespace-nowrap"
				>
					Add Folder
				</button>
			</form>
			<ReactSortable
				list={folders}
				setList={setFolders}
				onEnd={(evt) => {
					const newOrder = [...folders];
					const [movedItem] = newOrder.splice(evt.oldIndex, 1);
					newOrder.splice(evt.newIndex, 0, movedItem);

					setFolders(newOrder);
					saveOrder(newOrder);
				}}
				animation={500}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
			>
				{folders.map((folder) => (
					<div
						key={folder._id}
						className="border p-4 rounded-lg shadow-md bg-gray-50"
					>
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-lg font-semibold">{folder.name}</h2>
							<button
								onClick={() => {
									deleteFolder(folder._id);
									toast.error("Folder deleted.");
								}}
								className="text-red-500"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
									/>
								</svg>
							</button>
						</div>
						<ImageInput
							images={folder.images}
							onUpdate={(updatedImages) =>
								updateFolder(folder._id, updatedImages)
							}
						/>
					</div>
				))}
			</ReactSortable>
		</Layout>
	);
}
