// API routes for email verification

import db from "@/server/db";
import { verificationTokens } from "@/server/db/schema";
import { signToken } from "@/utils/jwtToken";
import { sendMail } from "@/utils/sendMail";
import { eq } from "drizzle-orm";
import { User } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const {email} = await req.json();
        if (!email) {
            return NextResponse.json({
                message: "Email is required",
                error: true,
                status: 400
            }, { status: 400 });
        }

        const existingUser = await db.select().from(User).where(eq(User.email, email));

        if (existingUser.length === 0) {
            return NextResponse.json({
                message: "Unauthorized",
                error: true,
                status: 404
            }, { status: 404 });
        }

        const user = existingUser[0];
        const token = signToken({
            email: user.email,
            id: user.id,
            role: user.role
        });

        await sendMail(user.email, user.fullName, token);
        await db.insert(verificationTokens).values({
            identifier: user.id,
            token: token,
            expires: new Date(Date.now() + 15 * 60 * 1000)
        });
        return NextResponse.json({
            message: "Verification email sent successfully",
            status: 200
        }, { status: 200 });
        
    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            error: true,
            status: 500
        }, { status: 500 });
        
    }
}