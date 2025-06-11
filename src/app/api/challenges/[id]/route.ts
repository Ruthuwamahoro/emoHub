import db from "@/server/db";
import { ChallengeElements, Challenges } from "@/server/db/schema";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest, {params}: {params: Promise<{id: string}>}){
    try {
        const { id } = await params;
        const challenge = await db.select().from(Challenges).where(eq(Challenges.id, id));
        return sendResponse(200, challenge, 'element created successfully')
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An expected error occured';
        return sendResponse(500, null, err);
    }
}
export async function DELETE(req:NextRequest, {params}: {params: Promise<{id: string}>}){
    try {
        const { id } = await params;
        await db.delete(Challenges).where(eq(Challenges.id, id));
        return sendResponse(200, null, 'element created successfully')
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An expected error occured';
        return sendResponse(500, null, err);
    }
}

