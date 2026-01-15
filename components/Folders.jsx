import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactSortable } from "react-sortablejs";
import ImageInput from "./ImageInput";
import toast from "react-hot-toast";

export default function Folders() {
	const [folders, setFolders] = useState([]);
	const [newFolderName, setNewFolderName] = useState("");

	useEffect(() => {
		axios.get("/api/folders").then((response) => setFolders(response.data));
	}, []);

	async function createFolder(e) {
		e.preventDefault();
		if (!newFolderName.trim()) return;
		const response = await axios.post("/api/folders", { name: newFolderName });
		setFolders([...folders, response.data]);
		setNewFolderName("");
	}

	async function deleteFolder(folderId) {
		await axios.delete(`/api/folders/?_id=${folderId}`);
		setFolders(folders.filter((folder) => folder._id !== folderId));
		toast.error("Folder deleted.");
	}

	async function updateFolder(folderId, updatedImages) {
		const response = await axios.put(`/api/folders`, {
			_id: folderId,
			images: updatedImages,
		});
		setFolders(
			folders.map((folder) =>
				folder._id === folderId ? response.data : folder
			)
		);
	}

	async function toggleFolderCover(folderId, imageUrl) {
		try {
			const folder = folders.find((f) => f._id === folderId);
			const nextCover = folder?.coverImage === imageUrl ? null : imageUrl;
			const response = await axios.put(`/api/folders`, {
				_id: folderId,
				coverImage: nextCover,
			});
			setFolders(folders.map((f) => (f._id === folderId ? response.data : f)));
			toast.success(nextCover ? "Cover selected!" : "Cover cleared!");
		} catch (error) {
			console.error("Failed to toggle cover image:", error);
			toast.error("Failed to update cover.");
		}
	}

	async function saveOrder(newOrder) {
		try {
			await axios.put("/api/reorder", { folders: newOrder });
		} catch (error) {
			toast.error("Failed to reorder folders.");
		}
	}

	return (
		<div className="mb-8">
			<h1 className="text-2xl font-bold mb-4">Folders</h1>
			<form
				onSubmit={createFolder}
				className="mb-4 flex gap-2 items-center max-w-xl"
			>
				<input
					type="text"
					placeholder="New folder name"
					value={newFolderName}
					onChange={(e) => setNewFolderName(e.target.value)}
					className="border p-2 mb-0"
				/>
				<button className="bg-gray-500 text-white px-4 py-2 rounded-sm whitespace-nowrap">
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
				className="flex flex-col gap-5"
			>
				{folders.map((folder) => (
					<div key={folder._id} className="border p-4 rounded-lg bg-gray-50">
						<div className="flex justify-between items-center">
							<h3 className="font-semibold">{folder.name}</h3>
							<button
								onClick={() => deleteFolder(folder._id)}
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
						<p className="text-sm text-gray-600 mb-2">
							{!folder.images && "No images in this folder"}
						</p>
						<ImageInput
							images={folder.images}
							coverImage={folder.coverImage}
							onToggleCover={(imageUrl) =>
								toggleFolderCover(folder._id, imageUrl)
							}
							onUpdate={(updatedImages) =>
								updateFolder(folder._id, updatedImages)
							}
						/>
					</div>
				))}
			</ReactSortable>
		</div>
	);
}
