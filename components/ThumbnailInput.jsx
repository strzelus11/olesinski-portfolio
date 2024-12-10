import axios from "axios";
import { useState } from "react";
import Spinner from "./Spinner";
import toast from "react-hot-toast";

export default function ThumbnailInput({ initialImage, onUpdate }) {
	const [image, setImage] = useState(initialImage || null);
	const [loading, setLoading] = useState(false);

	async function uploadImage(e) {
		const files = e.target?.files;
		if (files.length === 1) {
			setLoading(true);

			const data = new FormData();
			data.set("file", files[0]);
			console.log(data);

			try {
				const response = await axios.post("/api/upload", data, {
					timeout: 60000,
				});
				const uploadedImage = response.data.links[0];
				setImage(uploadedImage);
				onUpdate(uploadedImage);
				toast.success("Image uploaded successfully!");
			} catch (error) {
				console.error("Error uploading image:", error);
				toast.error("Failed to upload image.");
			} finally {
				setLoading(false);
			}
		}
	}

	function removeImage() {
		setImage(null);
		onUpdate(null);
	}

	return (
		<>
			{!image ? (
				<label className="size-24 cursor-pointer rounded-lg border flex flex-col items-center justify-center gap-1 text-black bg-gray-100 shadow-md mb-1">
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
							d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
						/>
					</svg>
					Upload
					<input onChange={uploadImage} type="file" className="hidden" />
				</label>
			) : (
				<div className="relative group aspect-[3/2]">
					<img
						src={image}
						className="w-full h-full object-cover rounded-lg shadow-lg"
						alt="Uploaded"
					/>
					<button
						onClick={removeImage}
						className="sm:opacity-0 group-hover:opacity-100 transition-all delay-100 duration-300 absolute -top-2 -right-2 bg-gray-50 border border-color-300 rounded-full p-1 size-6 flex items-center justify-center text-color-700 cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-6"
						>
							<path
								fillRule="evenodd"
								d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			)}
			{loading && (
				<div className="flex items-center justify-center">
					<Spinner />
				</div>
			)}
		</>
	);
}
