import db from "@/server/db";
import { Challenges } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest, segmentedData: {
    params: {
        ids: string;
    }
}) => {
    const userSession = await getUserIdFromSession();
    if (!userSession) {
        return sendResponse(401, null, "Unauthorized");
    }

    try {
        
        
            const params = await segmentedData.params;
            const ids = await params.ids;
        
            if(!ids) {
                return sendResponse(400, null, "Challenge ID is required");
            }
        
            const challenge = await db.select().from(Challenges).where(eq(Challenges.id, ids)).execute();
            return sendResponse(200, challenge, "Challenge fetched successfully");
    } catch (error) {
        const err = error instanceof Error ? error.message : "Unexpected error occurred";
        return sendResponse(500, null, err);
        
    }

}