import db from "@/server/db";
import { DailyReflectionsResponse } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, {params}: {params: Promise<{id: string}>}){
    try {
        const { id } = await params;
        const body = await req.json();
        const userId = await getUserIdFromSession();
        if(!userId) {
            return sendResponse(401, null, "Unauthorized");
        }
        const responseData = {
            ...body,
            userId,
            reflectionId: id,
            is_completed: true
        };
        await db.insert(DailyReflectionsResponse).values(responseData);
        return sendResponse(200, responseData, 'Response created successfully');
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An expected error occured';
        return sendResponse(500, null, err);
    }
}