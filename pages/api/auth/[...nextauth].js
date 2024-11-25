import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import { User } from "../../../models/User";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { mongooseConnect } from "../../../lib/mongoose";

export const authOptions = {
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
				await mongooseConnect();

				const email = credentials?.email;
				const password = credentials?.password;

				const user = await User.findOne({ email });

				if (!user) {
					console.log("User not found");
					return null;
				}
				if (bcrypt.compareSync(password, user.password)) {
					return {
						id: user._id.toString(),
						email: user.email,
					};
				} else {
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
