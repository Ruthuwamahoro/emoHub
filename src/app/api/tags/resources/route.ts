import db from "@/server/db";
import { learningResources, UserEmotion } from "@/server/db/schema";
import { sendResponse } from "@/utils/Responses";
import { desc} from "drizzle-orm";

export async function GET(){
    try {
        const resourcesTags = await db.select(
            {
                tags: learningResources.tags
            }
        ).from(learningResources)


            .orderBy(desc(learningResources.createdAt));
        const allTags = resourcesTags
            .flatMap(row => Array.isArray(row.tags) ? row.tags : [])
            .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
            .map(tag => tag.trim().toLowerCase());
        const uniqueTags = Array.from(new Set(allTags));
        return sendResponse(200, uniqueTags, "Tags retrieved successfully!");
    } catch (error) {
        return sendResponse(500, null, error instanceof Error ? error.message : 'An unexpected error occurred');
    }
} 