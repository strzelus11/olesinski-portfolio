import mongoose from "mongoose";

let isConnected = false;

export async function mongooseConnect() {
	if (isConnected) {
		console.log("Reusing existing database connection");
		return;
	}

	if (!process.env.MONGODB_URI) {
		console.error('Missing environment variable: "MONGODB_URI"');
		throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
	}

	console.log("Attempting to connect to MongoDB...");
	try {
		const db = await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		isConnected = db.connections[0].readyState === 1;
		console.log("Connected to MongoDB successfully");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		throw error;
	}
}
