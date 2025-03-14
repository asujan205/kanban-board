import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/logout",
    newUser: "/register",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Credentials not provided.");
        }
        const user = await db.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password || "",
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }
        return { id: user.id, email: user.email };
      },
    }),
  ],

  callbacks: {
    session({ session, token }) {
      if (session.user) {
        interface User {
          id: string;
          email: string;
        }

        // Cast session.user to the updated User type
        const user = session.user as User;

        // Now you can assign values to the id and email properties
        user.id = token.id as string;
        user.email = token.email as string;
      }
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
