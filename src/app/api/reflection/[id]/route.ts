import db from "@/server/db";
import { DailyReflections } from "@/server/db/schema";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, {params}: {params: Promise<{id: string}>}){
    try {
        const { id } = await params;
        const body = await req.json();
        await db.update(DailyReflections).set({
            ...body,
            updatedAt: new Date()
        }).where(eq(DailyReflections.id, id))
        return sendResponse(200, null, 'Updated successfully')
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An expected error occured';
        return sendResponse(500, null, err);
    }
}