import mongoose from "mongoose";

let isConnected = false;

export async function mongooseConnect() {
	if (isConnected) {
		return;
	}
	if (!process.env.MONGODB_URI) {
		throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
	}
	try {
		const db = await mongoose.connect(process.env.MONGODB_URI);
		isConnected = db.connections[0].readyState === 1;
		console.log("Database connected successfully");
	} catch (error) {
		console.error("Database connection error:", error);
		throw error;
	}
}
