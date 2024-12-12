/* eslint-disable @typescript-eslint/no-unused-vars */

import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      id: string;
      username: string;
      fullName: string;
      email: string;
      image: string;
      profilePicUrl: string;
      expertise: string;
      bio: string;
      role: string;
      location: string;
      anonymityPreference: string;
      badges: string;
    };
  }

  interface User extends DefaultSession["user"] {
    id: string;
    username: string;
    fullName: string;
    email: string;
    image: string;
    profilePicUrl: string;
    expertise: string;
    bio: string;
    role: string;
    location: string;
    anonymityPreference: string;
    badges: string;
    session_token?: string;
  }
}
