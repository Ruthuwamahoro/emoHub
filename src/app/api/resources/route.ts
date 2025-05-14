import { NextResponse , NextRequest } from "next/server";   
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import db from "@/server/db";
import { Resource } from "@/server/db/schema";
import { uploadImage } from "../groups/route";


export const POST = async(req: NextRequest) => {
    const userId = await getUserIdFromSession();
    if(!userId) {
        return sendResponse(401, null, "Unauthorized")
    }
    try {
        const { categoryId, title, coverImage, shortDescription, content, timeToRead} = await req.json();
        if(!categoryId || !title || !shortDescription || !content) {
            return sendResponse(400, null, "Please provide all the required fields")
        }

        let processedImage = null;
        if(coverImage) {
            processedImage = await uploadImage(coverImage);
        }
        await db.insert(Resource).values({
            categoryId,
            title,
            timeToRead,
            coverImage: processedImage,
            shortDescription,
            content,
        }).returning();
        return sendResponse(200, null, "Resource created successfully")
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
        const allResources = await db.select().from(Resource);
        if(allResources.length === 0) {
            return sendResponse(404, null, "No resources found")
        }
        return sendResponse(200, allResources, "Resources fetched successfully")
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : "Internal Server Error";
        return sendResponse(500, null, err); 
    }
}