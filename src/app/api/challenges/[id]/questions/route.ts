import db from "@/server/db";
import { ChallengeElements } from "@/server/db/schema";
import { sendResponse } from "@/utils/Responses";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest, {params}: {params: Promise<{id: string}>}){
    try {
        const { id } = await params;
        const body = await req.json();
        const insertedData = {
            ...body,
            challenge_id: id,
        }
        await db.insert(ChallengeElements).values(insertedData);
        return sendResponse(200, null, 'elements created successfully')
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An expected error occured';
        return sendResponse(500, null, err);
    }
}