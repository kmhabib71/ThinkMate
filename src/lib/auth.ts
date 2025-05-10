import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { redirect } from "next/navigation";
import dbConnect from "./db";
import User from "@/models/User";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();

          // Find user and explicitly select password field
          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          );

          if (!user) {
            return null;
          }

          // Verify password
          const isPasswordMatch = await user.comparePassword(
            credentials.password
          );

          if (!isPasswordMatch) {
            return null;
          }

          // Return user without password
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || null,
            image: user.image || null,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
      }

      // If Google login, save user to database if not exists
      if (account && account.provider === "google") {
        try {
          await dbConnect();

          const existingUser = await User.findOne({ email: token.email });

          if (!existingUser) {
            const newUser = new User({
              email: token.email,
              name: token.name,
              image: token.picture,
              emailVerified: new Date(),
            });

            await newUser.save();
            token.id = newUser._id.toString();
          } else {
            token.id = existingUser._id.toString();
          }
        } catch (error) {
          console.error("Error saving Google user:", error);
        }
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getSession = async () => {
  const session = await fetch("/api/auth/session");
  const data = await session.json();
  return data;
};

export const signOut = async () => {
  const response = await fetch("/api/auth/signout", {
    method: "POST",
  });

  if (response.ok) {
    window.location.href = "/auth/sign-in";
  }
};

export const getCurrentUser = async () => {
  const session = await getSession();

  if (!session || !session.user) {
    redirect("/auth/sign-in");
  }

  return session.user;
};
