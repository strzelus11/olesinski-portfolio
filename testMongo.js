const mongoose = require("mongoose");

async function testConnection() {
	const uri =
		"mongodb+srv://admin:pola1234@photos.owije.mongodb.net/?retryWrites=true&w=majority&appName=Photos";

	if (!uri) {
		console.error("MONGODB_URI not set in environment variables");
		return;
	}

	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected successfully to MongoDB");
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
	} finally {
		await mongoose.disconnect();
	}
}

testConnection();
