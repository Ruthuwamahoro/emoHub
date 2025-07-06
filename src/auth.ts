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
      gender?: string;
      isOnboardingCompleted?: boolean;
    },
    loginTime?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    sub?: string;
    loginTime?: number;
     isOnboardingCompleted?: boolean; 
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
              gender: User.gender,
              roleName: Role.name,
              isOnboardingCompleted: User.onboardingCompleted,
            })
            .from(User)
            .innerJoin(Role, eq(User.role, Role.id)) 
            .where(eq(User.email, credentials.email))
            .limit(1)
          
          if (existingUser.length === 0) {
            throw new Error("No user found");
          }

          const user = existingUser[0];

          if (!user.isVerified) {
            throw new Error("Please verify your email");
          }

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
            gender: user.gender,
            isOnboardingCompleted: user.isOnboardingCompleted,
          };
          
        } catch (error) {
          console.error("Auth error:", error);
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
            isVerified: true, // OAuth users are auto-verified
            onboardingCompleted: false, // New users need onboarding
          });
        }
      }
      
      return true;
    },
    
    // Add redirect callback to handle conditional redirects
    async redirect({ url, baseUrl }) {
      // If it's a relative URL, make it absolute
      if (url.startsWith('/')) {
        url = baseUrl + url;
      }
      
      // Always allow redirects to the same origin
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Default fallback
      return baseUrl;
    },
    
    async jwt({ token, user, account }) {
      if (account && user) {
        token.loginTime = Date.now();
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.sub = user.id;
        // Store onboarding status in token for redirect logic
        token.isOnboardingCompleted = user.isOnboardingCompleted;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user && token.email) {
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
              gender: User.gender,
              isOnboardingCompleted: User.onboardingCompleted,
            })
            .from(User)
            .innerJoin(Role, eq(User.role, Role.id))
            .where(eq(User.email, token.email))
            .limit(1);

          if (userData.length > 0) {
            const user = userData[0];
            session.user.id = user.id;
            session.user.email = user.email;
            session.user.fullName = user.fullName;
            session.user.username = user.username || "";
            session.user.role = user.roleName;
            session.user.profilePicUrl = user.profilePicUrl || undefined;
            session.user.expertise = user.expertise || undefined;
            session.user.isActive = user.isActive || true;
            session.user.gender = user.gender || undefined;
            session.user.isOnboardingCompleted = user.isOnboardingCompleted || false;
            session.loginTime = token.loginTime;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
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
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true, 
        maxAge: 30 * 24 * 60 * 60
      }
    }
  } as any,
  pages: {
    signIn: '/login',
    error: '/login',
  }
};