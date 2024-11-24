import { ClipLoader } from "react-spinners";

export default function Spinner() {
	return (
		<div className="flex items-center justify-center z-50">
			<ClipLoader color="#000000" />
		</div>
	);
}
