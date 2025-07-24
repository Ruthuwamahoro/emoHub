import db from "@/server/db";
import { UserEmotion } from "@/server/db/schema";
import { sendResponse } from "@/utils/Responses";
import { desc} from "drizzle-orm";

export async function GET(){
    try {
        const tags = await db.select(
            {
                activities: UserEmotion.activities
            }
        ).from(UserEmotion)


            .orderBy(desc(UserEmotion.createdAt));
        const allTags = tags.flatMap(row => row.activities).map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
        const uniqueTags = Array.from(new Set(allTags));
        return sendResponse(200, uniqueTags, "Tags retrieved successfully!");
    } catch (error) {
        return sendResponse(500, null, error instanceof Error ? error?.message : 'An unexpected error occurred');
    }
} 