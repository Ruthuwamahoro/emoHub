import { NextRequest, NextResponse} from "next/server";
import  db  from "@/server/db";
import { ResourceCategory } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";

export const POST = async( req: NextRequest ) => {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return sendResponse(401, null, "Unauthorized");
    }
    try {
        const { name, description } = await req.json();
        if (!name || !description) {
            return sendResponse(400, null, "Name and description are required")
        } 
        await db.insert(ResourceCategory).values({
            name,
            description,
        }).returning();
        return sendResponse(200, null, "Resource category created successfully")
    } catch (error) {
        const err = error instanceof Error ? error?.message : "Internal Server Error";
        return sendResponse(500, null, err);
        
    }
}

export const GET = async(req: NextRequest) => {
    const userId = await getUserIdFromSession();
    if(!userId) {
        return sendResponse(401, null, "Unauthorized")
    }
    try {
        const allCategories = await db.select().from(ResourceCategory);
        if(allCategories.length === 0) {
            return sendResponse(404, null, "No resource categories found")
        }
        return sendResponse(200, allCategories, "Resource categories fetched successfully")
    } catch (error) {
        const err = error instanceof Error ? error?.message : "Internal Server Error";
        return sendResponse(500, null, err);
        
    }
}
