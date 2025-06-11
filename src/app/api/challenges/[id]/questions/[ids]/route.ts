import db from "@/server/db";
import { ChallengeElements } from "@/server/db/schema";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function DELETE(req:NextRequest, {params}: {params: Promise<{ids: string}>}){
    try {
        const { ids } = await params;
        await db.delete(ChallengeElements).where(eq(ChallengeElements.id, ids));
        return sendResponse(200, null, 'element created successfully')
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An expected error occured';
        return sendResponse(500, null, err);
    }
}
export async function PATCH(req:NextRequest, {params}: {params: Promise<{ids: string}>}){
    try {
        const { ids } = await params;
        const body = await req.json();
        await db.update(ChallengeElements).set({
            ...body,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            updated_at: new Date()
        }).where(eq(ChallengeElements.id, ids))
        return sendResponse(200, null, 'Element updated successfully')
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An expected error occured';
        return sendResponse(500, null, err);
    }
}