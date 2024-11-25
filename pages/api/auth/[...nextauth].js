import clientPromise from "./lib/mongodb";
import bcrypt from "bcryptjs";
import { User } from "./models/User";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { mongooseConnect } from "./lib/mongoose";
import mongoose from "mongoose";

export const authOptions = {
	debug: true,
	secret: process.env.NEXTAUTH_URL,
	session: {
		strategy: "jwt",
	},
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			id: "credentials",
			credentials: {
				username: {
					label: "Email",
					type: "email",
					placeholder: "test@example.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				console.log("Starting mongoose connection...");
				await mongooseConnect();
				console.log("Mongoose connected");

				const email = credentials?.email;
				const password = credentials?.password;

				console.log(`Finding user with email: ${email}`);
				const user = await User.findOne({ email });

				if (!user) {
					console.log("User not found");
					return null;
				}

				console.log("User found, validating password...");
				if (bcrypt.compareSync(password, user.password)) {
					console.log("Password validated, returning user");
					return {
						id: user._id.toString(),
						email: user.email,
						name: user.name,
					};
				} else {
					console.log("Invalid password");
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id;
			return session;
		},
	},
};

export default NextAuth(authOptions);
