import axios from "axios";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Spinner from "./Spinner";
import toast from "react-hot-toast";

export default function ImageInput({
	images: initialImages,
	onUpdate,
	coverImage = null,
	onToggleCover,
}) {
	const [images, setImages] = useState(initialImages || []);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setImages(initialImages || []);
	}, [initialImages]);

	async function uploadImages(e) {
		const inputEl = e.currentTarget;
		const files = inputEl?.files;
		if (!files || files.length === 0) return;

		setLoading(true);

		// Optional: show progress in UI if you have a state for it
		// setUploadProgress({ done: 0, total: files.length });

		const fileArray = Array.from(files);
		const batchSize = 2; // keep smaller for Vercel/serverless stability
		let uploadedLinks = [];
		let failedCount = 0;

		// One “loading” toast that we update (much nicer UX)
		const toastId = toast.loading(`Uploading 0 / ${fileArray.length}...`);

		try {
			for (let i = 0; i < fileArray.length; i += batchSize) {
				const batch = fileArray.slice(i, i + batchSize);
				const data = new FormData();
				batch.forEach((file) => data.append("file", file));

				try {
					const response = await axios.post("/api/upload", data, {
						timeout: 120000,
					});

					const links = response?.data?.links || [];
					uploadedLinks.push(...links);
				} catch (error) {
					failedCount += batch.length;

					// Log real server response if present (useful for debugging)
					console.error(
						"Upload batch failed:",
						error?.response?.status,
						error?.response?.data,
						error?.message
					);
				}

				const done = Math.min(i + batchSize, fileArray.length);
				toast.loading(`Uploading ${done} / ${fileArray.length}...`, {
					id: toastId,
				});

				// Optional: update progress state
				// setUploadProgress({ done, total: fileArray.length });
			}

			// If nothing uploaded, do NOT update folder and show a clean error
			if (uploadedLinks.length === 0) {
				toast.error("Upload failed. No files were uploaded.", { id: toastId });
				return;
			}

			const updatedImages = [...images, ...uploadedLinks];
			setImages(updatedImages);
			onUpdate(updatedImages);

			// Single final toast (no double messages)
			if (failedCount > 0) {
				toast.success(
					`Uploaded ${uploadedLinks.length} file(s). Failed: ${failedCount}.`,
					{ id: toastId }
				);
			} else {
				toast.success(`Uploaded ${uploadedLinks.length} file(s).`, {
					id: toastId,
				});
			}
		} finally {
			setLoading(false);
			if (inputEl) inputEl.value = ""; // allow reselecting same files
		}
	}

	function updateImagesOrder(updatedImages) {
		setImages(updatedImages);
		onUpdate(updatedImages);
	}

	function removeImage(removedImage) {
		const updatedImages = images.filter((image) => image !== removedImage);
		setImages(updatedImages);
		onUpdate(updatedImages);
		if (onToggleCover && coverImage === removedImage) {
			// Clear cover if the cover image was deleted
			onToggleCover(removedImage);
		}
	}

	function isCover(link) {
		return !!coverImage && coverImage === link;
	}

	return (
		<div>
			<div className="my-2 flex flex-wrap gap-3">
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
					<input
						onClick={(e) => {
							// Ensure selecting the same file(s) triggers onChange
							e.currentTarget.value = "";
						}}
						onChange={uploadImages}
						type="file"
						multiple
						className="hidden"
					/>
				</label>
				{loading && (
					<div className="h-24 w-24 flex items-center justify-center">
						<Spinner />
					</div>
				)}
				<ReactSortable
					className="grid grid-cols-3 sm:flex flex-wrap gap-3"
					list={images}
					setList={updateImagesOrder}
					animation={500}
					filter=".sortable-ignore"
					preventOnFilter={true}
				>
					{images?.length > 0 &&
						images.map((link, index) => {
							const selected = isCover(link);
							return (
								<div
									key={index}
									className={`h-24 shadow-lg relative group border-2 rounded-lg transition-all delay-100 duration-300 ${
										selected ? "border-green-500" : "border-transparent"
									} ${onToggleCover ? "cursor-pointer" : ""}`}
									onClick={() => {
										if (onToggleCover) onToggleCover(link);
									}}
									title={onToggleCover ? "Click to toggle cover" : undefined}
								>
									<img
										src={link}
										className="sm:w-full h-full rounded-md object-cover"
										alt=""
									/>

									{selected && (
										<div className="sortable-ignore absolute -top-2 -left-2 bg-gray-50 border-2 border-green-500 rounded-full p-1 size-6 flex items-center justify-center text-green-500">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="size-6"
											>
												<path
													fillRule="evenodd"
													d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
									)}

									<div
										className="sortable-ignore sm:opacity-0 group-hover:opacity-100 transition-all delay-100 duration-300 absolute -top-2 -right-2 bg-gray-50 border border-color-300 rounded-full p-1 size-6 flex items-center justify-center text-color-700 cursor-pointer"
										onPointerDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onTouchStart={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											removeImage(link);
										}}
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
									</div>
								</div>
							);
						})}
				</ReactSortable>
			</div>
		</div>
	);
}
