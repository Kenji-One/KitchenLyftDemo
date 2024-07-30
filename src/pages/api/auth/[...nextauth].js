import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../utils/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      authorize: async (credentials) => {
        await connectDB();
        const user = await User.findOne({ username: credentials.username });
        if (
          user &&
          bcrypt.compareSync(credentials.password, user.passwordHash)
        ) {
          // console.log("User found:", user);
          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            image: user.image || null,
            role: user.role,
          };
        }
        console.log("User not found or incorrect password");
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // console.log("JWT callback - token:", token);
      // console.log("JWT callback - user:", user);
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image || null;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // console.log("Session callback - session:", session);
      // console.log("Session callback - token:", token);
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.image || null,
          role: token.role,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
