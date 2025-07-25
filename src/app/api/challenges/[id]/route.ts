import db from "@/server/db";
import { Challenges } from "@/server/db/schema";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest, {params}: {params: Promise<{id: string}>}){
    try {
        const { id } = await params;
        const challenge = await db.select().from(Challenges).where(eq(Challenges.id, id));
        return sendResponse(200, challenge, 'element retrieved successfully')
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An expected error occured';
        return sendResponse(500, null, err);
    }
}
export async function DELETE(req:NextRequest, {params}: {params: Promise<{id: string}>}){
    try {
        const { id } = await params;
        await db.delete(Challenges).where(eq(Challenges.id, id));
        return sendResponse(200, null, 'element deleted successfully')
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An expected error occured';
        return sendResponse(500, null, err);
    }
}

export async function PATCH(req: NextRequest, {params}: {params: Promise<{id: string}>}){
    try {
        const { id } = await params;
        const body = await req.json();
        await db.update(Challenges).set({
            ...body,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            updated_at: new Date()
        }).where(eq(Challenges.id, id))
        return sendResponse(200, null, 'Updated successfully')
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An expected error occured';
        return sendResponse(500, null, err);
    }
}

