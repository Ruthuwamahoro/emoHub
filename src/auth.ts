import type { NextAuthOptions } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import db from "./server/db";
import { eq } from "drizzle-orm";
import { User, Role} from "@/server/db/schema"
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const options: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    Github({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password_hash: { label: "password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        try {
          if (!credentials?.email || !credentials.password_hash) {
            throw new Error("Missing credentials");
          }

          const existingUser = await db
            .select()
            .from(User)
            .where(eq(User.email, credentials.email))
            .limit(1);

          if (existingUser.length === 0) {
            throw new Error("No user found");
          }

          const user = existingUser[0];
          const isPasswordValid = await bcrypt.compare(
            credentials.password_hash,
            user.passwordHash ?? ""
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            // roleId: user.roleId,
            // image: null,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },
  callbacks: {
    async signIn({ user, account }) {
      if (!user || !user.email || !account) {
        return false;
      }
    
      if (account.provider === "google" || account.provider === "github") {
        const email = user.email;
        const name = user.name || "";
    
        const existingUser = await db
          .select()
          .from(User)
          .where(eq(User.email, email))
          .limit(1);
    
        if (existingUser.length === 0) {
          const userRole = await db
            .select({ id: Role.id })
            .from(Role)
            .where(eq(Role.name, "User"))
            .limit(1);
    
          if (userRole.length === 0) {
            return false;
          }
    
          await db.insert(User).values({
            email,
            username: "",
            fullName: name,
            role: userRole[0].id,
          });
        } else {
          user.id = existingUser[0].id;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // token.username = user.username;
        // token.role = user.roleId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // session.user.id = token.id as string;
        session.user.email = token.email as string;
        // session.user.username = token.username as string;
        // session.user.roleId = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
  },
};
