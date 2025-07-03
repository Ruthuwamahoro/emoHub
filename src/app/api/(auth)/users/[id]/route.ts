import db from "@/server/db";
import { Role, User } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
    try {
        const userId = await getUserIdFromSession();

        if (!userId) {
            return sendResponse(403, null, "Forbidden");
        }

        const user = await db.select({
                id: User.id,
                email: User.email,
                fullName: User.fullName,
                username: User.username,
                profilePicUrl: User.profilePicUrl,
                expertise: User.expertise,
                isActive: User.isActive,
                role: {
                    name: Role.name,
                },
                createdAt: User.createdAt,
                updatedAt: User.updatedAt

            }
        ).from(User)
        .innerJoin(Role, eq(Role.id, User.role))
        .where(eq(User.id, userId))

        return sendResponse(200, user, 'User retrieved successfully');
        
    } catch (error) {
        return sendResponse(500, null, error instanceof Error ? error?.message : 'An expected error occured');
    }
}