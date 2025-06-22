import db from "@/server/db";
import { User, UserEmotion } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";


export async function GET (req: NextRequest){
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return sendResponse(401, null, "Unauthorized");
        }
        const emotions = await db.select(
            {
                id: UserEmotion.id,
                feelings: UserEmotion.feelings,
                emotionIntensity: UserEmotion.emotionIntensity,
                activities: UserEmotion.activities,
                notes: UserEmotion.notes,
                createdAt: UserEmotion.createdAt,
                updatedAt: UserEmotion.updatedAt,
                user: {
                    id: User.id,
                    username: User.username,
                    image: User.profilePicUrl,
                    name: User.fullName,
                }
            }
        ).from(UserEmotion)
        .innerJoin(User, eq(UserEmotion.userId, User.id)).orderBy(desc(UserEmotion.createdAt));
        if (emotions.length === 0) {
            return sendResponse(404, null, "No emotions recorded yet.");
        }
        return sendResponse(200, emotions, "Emotions retrieved successfully!");
        
    } catch (error) {
        return sendResponse(500, null, error instanceof Error ? error.message : "Internal Server Error");
    }
}