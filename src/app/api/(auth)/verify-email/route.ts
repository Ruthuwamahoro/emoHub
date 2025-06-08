// API routes verify email

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/jwtToken";
import db from "@/server/db";
import { eq } from "drizzle-orm";
import { User, verificationTokens } from "@/server/db/schema";

export const POST = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({
        message: "Token is required",
        error: true,
        status: 400
      }, { status: 400 });
    }
    const checkIfTokenExists = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token));
    if(checkIfTokenExists.length === 0) {
      return NextResponse.json({
        message: "Invalid or expired token",
        error: true,
        status: 400
      }, { status: 400 });
    }

    const tokenData = checkIfTokenExists[0];
    if(new Date() > tokenData.expires) {
      await db.delete(verificationTokens).where(eq(verificationTokens.token, token));
      return NextResponse.json({
        message: "Token has expired",
        error: true,
        status: 400
      }, { status: 400 });
    }

    const decoded = await verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({
        message: "Invalid or expired token",
        error: true,
        status: 400
      }, { status: 400 });
    }

    const { email, id } = decoded;

    const existingUser = await db.select().from(User).where(eq(User.email, email as string));
    
    if (existingUser.length === 0) {
      return NextResponse.json({
        message: "Unauthorized",
        error: true,
        status: 404
      }, { status: 404 });
    }

    if (existingUser[0].isVerified) {
      return NextResponse.json({
        message: "Email already verified",
        error: false,
        status: 200
      }, { status: 200 });
    }

    await db.update(User)
      .set({ isVerified: true })
      .where(eq(User.id, id as string));
    
    await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

    return NextResponse.json({
      message: "Email verified successfully",
      error: false,
      status: 200
    }, { status: 200 });

  } catch (error) {
    console.error("Email verification error:", error);
    const err = error instanceof Error ? error.message : "An unknown error occurred";
    
    return NextResponse.json({
      message: err,
      error: true,
      status: 500
    }, { status: 500 });
  }
};
