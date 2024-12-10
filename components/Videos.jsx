import React, { useState, useEffect } from "react";
import axios from "axios";
import ThumbnailInput from "./ThumbnailInput";
import toast from "react-hot-toast";

export default function Videos() {
	const [videos, setVideos] = useState([]);
	const [newVideoLink, setNewVideoLink] = useState("");

	useEffect(() => {
		axios.get("/api/videos").then((response) => setVideos(response.data));
	}, []);

	async function addVideo(e) {
		e.preventDefault();
		if (!newVideoLink.trim()) {
			toast.error("Video link cannot be empty.");
			return;
		}

		try {
			const response = await axios.post("/api/videos", { link: newVideoLink });
			setVideos([...videos, response.data]);
			toast.success("Video added!");
			setNewVideoLink("");
		} catch (err) {
			toast.error("Error adding video.");
			console.error("Error adding video:", err);
		}
	}

	async function deleteVideo(videoId) {
		await axios.delete(`/api/videos/?_id=${videoId}`);
		setVideos(videos.filter((video) => video._id !== videoId));
	}

	async function updateThumbnail(videoId, thumbnail) {
		try {
			const updatedVideo = { _id: videoId, thumbnail: thumbnail || "" };
			await axios.put("/api/videos", updatedVideo);

			setVideos(
				videos.map((v) => (v._id === videoId ? { ...v, thumbnail } : v))
			);
		} catch (err) {
			console.error("Error updating thumbnail:", err);
		}
	}

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Videos</h1>
			<form
				onSubmit={addVideo}
				className="mb-4 flex gap-2 items-center max-w-xl"
			>
				<input
					type="text"
					placeholder="Video Link"
					value={newVideoLink}
					onChange={(e) => setNewVideoLink(e.target.value)}
					className="border p-2 mb-0 flex-grow"
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 whitespace-nowrap"
				>
					Add Video
				</button>
			</form>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{videos.map((video) => (
					<div key={video._id} className="border p-4 rounded-lg bg-gray-50">
						<div className="flex gap-2 items-center">
							<h3 className="font-semibold mb-0 truncate">{video.link}</h3>
							<button
								onClick={() => deleteVideo(video._id)}
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
							{!video.thumbnail && "No thumbnail yet"}
						</p>
						<ThumbnailInput
							initialImage={video.thumbnail}
							onUpdate={(updatedImage) => {
								if (updatedImage) {
									updateThumbnail(video._id, updatedImage);
								} else {
									updateThumbnail(video._id, null);
								}
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
