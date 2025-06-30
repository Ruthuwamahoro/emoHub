import db from "@/server/db";
import { ReportPost } from "@/server/db/schema";
import { sendResponse } from "@/utils/Responses";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    try {

        const body = await req.json();
        const insertData = {
            ...body,
            createdAt: new Date(),
            updateAt: new Date()
        }

        await db.insert(ReportPost).values(insertData);

        return sendResponse(200, null, "Reporting this post done successfully")
        
    } catch (error) {
        return sendResponse(500, null, error instanceof Error ? error?.message : "Unexpected error occured");
    }
}