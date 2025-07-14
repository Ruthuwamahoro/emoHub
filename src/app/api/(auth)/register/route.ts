import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db/index";
import { User, Role, verificationTokens } from "@/server/db/schema";
import { validateRegisterData } from "@/utils/validation/validateField";
import { signToken } from "@/utils/jwtToken";
import { sendMail } from "@/utils/sendMail";

import { generateUniqueAnonymousName, generateAnonymousAvatar } from "@/utils/generateAnonymousName";

export async function POST(request: NextRequest) {
  try {
    const validatedBody = await validateRegisterData(request);
    if (validatedBody instanceof NextResponse) return validatedBody;
    
    console.log("Registration data:", validatedBody);
    const { fullName, username, email, password_hash } = validatedBody;

    const existingUser = await db.select().from(User)
      .where(or(eq(User.email, email), eq(User.username, username)));

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          message: "Username or email already exists",
          error: true
        },
        { status: 400 }
      );
    }

    const userRole = await db.select({ id: Role.id, name: Role.name })
      .from(Role)
      .where(eq(Role.name, "User"))
      .limit(1);

    if (userRole.length === 0) {
      return NextResponse.json(
        {
          message: "User role not found",
          error: true
        },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    let anonymousName: string;
    let anonymousAvatar: string;

    try {
      console.log("Generating anonymous name...");
      anonymousName = await generateUniqueAnonymousName();
      anonymousAvatar = generateAnonymousAvatar();
      console.log("Generated anonymous name:", anonymousName);
      console.log("Generated anonymous avatar:", anonymousAvatar);
    } catch (error) {
      console.error("Error generating anonymous name:", error);
      const timestamp = Date.now().toString().slice(-6);
      anonymousName = `Anonymous${timestamp}`;
      anonymousAvatar = `default_gray_1`;
    }

    const insertUser = await db.insert(User).values({
      fullName,
      email,
      username,
      password: hashedPassword,
      role: userRole[0].id,
      anonymousName: anonymousName,
      anonymousAvatar: anonymousAvatar,
      isAnonymous: false,
      isVerified: false,
      onboardingCompleted: false,
      isActive: true
    }).returning({
      id: User.id,
      email: User.email,
      fullName: User.fullName,
      username: User.username,
      anonymousName: User.anonymousName,
      role: User.role
    });

    if (insertUser.length === 0) {
      return NextResponse.json(
        {
          message: "Failed to create user",
          error: true
        },
        { status: 500 }
      );
    }

    const newUser = insertUser[0];
    console.log("User created successfully:", {
      id: newUser.id,
      email: newUser.email,
      anonymousName: newUser.anonymousName
    });

    const token = signToken({
      email: newUser.email,
      id: newUser.id,
      role: newUser.role
    });

    try {
      await sendMail(newUser.email, newUser.fullName, token);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
    }

    await db.insert(verificationTokens).values({
      identifier: newUser.id,
      token: token,
      expires: new Date(Date.now() + 15 * 60 * 1000)
    });

    return NextResponse.json({
      message: "Successfully registered",
      status: 200,
      data: {
        userId: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        username: newUser.username,
        anonymousName: newUser.anonymousName
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        message: error.message || "Registration failed",
        error: true
      },
      { status: 500 }
    );
  }
}