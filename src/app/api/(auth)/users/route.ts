import db from "@/server/db";
import { Role, User } from "@/server/db/schema";
import { checkIfUserIsAdmin, checkIfUserIsSuperAdmin } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
    try {

        const [isAdmin, isSuperAdmin] = await Promise.all([
            checkIfUserIsAdmin(),
            checkIfUserIsSuperAdmin()
        ]);

        const isAuthorized = isAdmin  || isSuperAdmin;

        if (!isAuthorized) {
            return sendResponse(403, null, "Forbidden");
        }

        const users = await db.select({
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
        .orderBy(User.username);
        if (users.length === 0) {
            return sendResponse(404, null, 'No users found');
        }

        return sendResponse(200, users, 'Users retrieved successfully');
        
    } catch (error) {
        console.error("Error fetching users:", error);
        return sendResponse(500, null, error instanceof Error ? error?.message : 'An expected error occured');
    }
}