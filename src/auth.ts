import type { NextAuthOptions } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "./server/db";
import { eq } from "drizzle-orm";
import { User, Role } from "@/server/db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      fullName: string;
      username: string;
      role: string;
      profilePicUrl?: string;
      expertise?: string;
      isActive: boolean;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    fullName: string;
    username: string;
    role: string;
    profilePicUrl?: string;
    expertise?: string;
    isActive: boolean;
  }
}

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
            .select({
              id: User.id,
              email: User.email,
              fullName: User.fullName,
              username: User.username,
              password: User.password,
              profilePicUrl: User.profilePicUrl,
              expertise: User.expertise,
              isActive: User.isActive,
              isVerified: User.isVerified,
              roleName: Role.name,
            })
            .from(User)
            .innerJoin(Role, eq(User.role, Role.id)) 
            .where(eq(User.email, credentials.email))
            .limit(1)
          
          if (existingUser.length === 0) {
            throw new Error("No user found");
          }

          
          const user = existingUser[0];

          if(user.isVerified){
            const isPasswordValid = await bcrypt.compare(
              credentials.password_hash,
              user.password ?? ""
            );

            
            if (!isPasswordValid) {
              throw new Error("Invalid password");
            }
            
            return {
              id: user.id,
              email: user.email,
              fullName: user.fullName,
              username: user.username,
              role: user.roleName, 
              profilePicUrl: user.profilePicUrl,
              expertise: user.expertise,
              isActive: user.isActive,
            };
          }

          return "Please verify your email";
          
        } catch (error) {
          return null;
        }
      },
    }),
  ],
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
            username: email.split('@')[0],
            fullName: name,
            role: userRole[0].id,
            isActive: true,
          });
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = user.fullName;
        token.username = user.username;
        token.role = user.role; 
        token.profilePicUrl = user.profilePicUrl;
        token.expertise = user.expertise;
      } else if (token.email) {
        try {
          const userData = await db
            .select({
              id: User.id,
              email: User.email,
              fullName: User.fullName,
              username: User.username,
              profilePicUrl: User.profilePicUrl,
              expertise: User.expertise,
              isActive: User.isActive,
              roleName: Role.name,
            })
            .from(User)
            .innerJoin(Role, eq(User.role, Role.id))
            .where(eq(User.email, token.email))
            .limit(1);

          if (userData.length > 0) {
            const user = userData[0];
            token.id = user.id;
            token.fullName = user.fullName;
            token.username = user.username ?? undefined;
            token.role = user.roleName;
            token.profilePicUrl = user.profilePicUrl ?? undefined;
            token.expertise = user.expertise ?? undefined;
            token.isActive = user.isActive ?? false;
          }
        } catch (error) {
          console.error("Error refreshing user data:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.fullName = token.fullName as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.profilePicUrl = token.profilePicUrl as string | undefined;
        session.user.expertise = token.expertise as string | undefined;
        session.user.isActive = token.isActive as boolean;
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