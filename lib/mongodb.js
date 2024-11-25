import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

// Use Stable API version for improved reliability
const options = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
	// In development, reuse the client to prevent exhausting connections
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri, options);
		global._mongoClientPromise = client.connect();
	}
	clientPromise = global._mongoClientPromise;
} else {
	// In production, always create a new client
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

// Export a promise to ensure MongoDB connection is established
export default clientPromise;
