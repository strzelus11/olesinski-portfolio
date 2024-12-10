import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

export default function SelectFeaturedImages() {
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedImages, setSelectedImages] = useState([]);

	function handleSelectImage(image) {
		setSelectedImages((prev) =>
			prev.some((img) => img.url === image)
				? prev.filter((img) => img.url !== image)
				: [...prev, { url: image }]
		);
	}

	async function handleSave() {
		const response = await axios.post("/api/featured", {
			images: selectedImages,
		});

		if (response.status === 200) {
			toast.success("Featured images updated!");
		} else {
			toast.error("Something went wrong.");
		}
	}

	useEffect(() => {
		setLoading(true);
		axios.get("/api/images").then((response) => setImages(response.data));
		axios
			.get("/api/featured")
			.then((response) => setSelectedImages(response.data.images));
		setLoading(false);
	}, []);

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Home Page</h2>
			<div className="grid grid-cols-3 sm:flex flex-wrap gap-3">
				{loading ? (
					<Spinner />
				) : (
					images?.map((image, index) => (
						<div
							key={index}
							className={`relative h-24 border-2 rounded-lg transition-all delay-100 duration-300 ${
								selectedImages.some(
									(selectedImage) => selectedImage.url === image
								)
									? "border-green-500"
									: "border-transparent"
							}`}
							onClick={() => handleSelectImage(image)}
						>
							<img src={image} className="sm:w-full h-full rounded-md" alt="" />
							<div
								className={`${
									selectedImages.some(
										(selectedImage) => selectedImage.url === image
									)
										? "opacity-100"
										: "opacity-0 "
								} transition-all delay-100 duration-300 absolute -top-2 -left-2 bg-gray-50 border-2 border-green-500 rounded-full p-1 size-6 flex items-center justify-center text-green-500 cursor-pointer`}
							>
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
						</div>
					))
				)}
			</div>
			<button
				onClick={handleSave}
				className="my-4 px-4 py-2 bg-gray-500 text-white"
			>
				Save Featured Images
			</button>
		</div>
	);
}
