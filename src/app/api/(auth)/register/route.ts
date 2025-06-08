// API routes for registration

import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db/index";
import { User, Role, verificationTokens } from "@/server/db/schema";
import { validateRegisterData } from "@/utils/validation/validateField";
import { signToken } from "@/utils/jwtToken";
import { sendMail } from "@/utils/sendMail";

export async function POST(request: NextRequest) {
    try {
        const validatedBody = await validateRegisterData(request);
        if (validatedBody instanceof NextResponse) return validatedBody;
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

        const userRole = await db.select({ id: Role.id , name: Role.name})
            .from(Role)
            .where(eq(Role.name, "User"))
            .limit(1);
        const password = await bcrypt.hash(password_hash, 10);
        const insertUser = await db.insert(User).values({
            fullName,
            email,
            username,
            password: password,
            role: userRole[0].id
        }).returning();

        const token = signToken({
            email: insertUser[0].email,
            id: insertUser[0].id,
            role: insertUser[0].role
        });
        
        await sendMail(insertUser[0].email, insertUser[0].fullName, token);
        await db.insert(verificationTokens).values({
            identifier: insertUser[0].id,
            token: token,
            expires: new Date(Date.now() + 15 * 60 * 1000)        
        })

        return NextResponse.json({
            message: "Successfully registered",
            status: 200
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { 
                message: error.message, 
                error: true 
            }, 
            { status: 500 }
        );
    }
}