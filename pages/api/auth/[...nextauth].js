import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { User } from "@/models/User";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { mongooseConnect } from "@/lib/mongoose";

export const authOptions = {
	secret: process.env.NEXTAUTH_SECRET,
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
			async authorize(credentials) {
				const { email, password } = credentials;

				console.log("Authenticating user:", email);
				try {
					await mongooseConnect();
					console.log("DB connection successful");

					const user = await User.findOne({ email });
					if (!user) {
						console.log("User not found");
						return null;
					}

					console.log("User found, checking password");

					const passwordMatch = bcrypt.compareSync(password, user.password);
					if (!passwordMatch) {
						console.log("Password mismatch");
						return null;
					}

					console.log("User authenticated successfully");
					return {
						id: user._id.toString(),
						email: user.email,
						name: user.name,
					};
				} catch (error) {
					console.error("Error during authentication:", error);
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
