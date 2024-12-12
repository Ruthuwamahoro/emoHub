import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db/index";
import { User, Role } from "@/server/db/schema";
import { validateRegisterData } from "@/utils/validation/validateField";

export async function POST(request: NextRequest) {
    try {
        const validatedBody = await validateRegisterData(request);
        if (validatedBody instanceof NextResponse) return validatedBody;

        const { fullName, username, email, password_hash } = validatedBody;

        // Check for existing user
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

        // Get user role
        const userRole = await db.select({ id: Role.id })
            .from(Role)
            .where(eq(Role.name, "User"))
            .limit(1);

        const password = await bcrypt.hash(password_hash, 10);

        // Insert new user
        await db.insert(User).values({
            fullName,
            email,
            username,
            passwordHash: password,
            role: userRole[0].id
        });

        const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
            expiresIn: "1h"
        });

        return NextResponse.json({
            message: "Successfully registered",
            data: token,
            status: 200
        }, { status: 200 });

    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { 
                message: "Registration failed", 
                error: true 
            }, 
            { status: 500 }
        );
    }
}