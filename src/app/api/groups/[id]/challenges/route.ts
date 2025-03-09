import db from "@/server/db";
import { Challenges } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "../../route";


export const POST = async (req: NextRequest,
    segmentedData:{
        params: Promise<{id: string}>
    }
) => {
    try {
        const params = await segmentedData.params;
        const { id } = params;
        const user_id = await getUserIdFromSession();
        
        if (!user_id) {
            return sendResponse(401, null, "Unauthorized");
        }
        console.log("User ID:", user_id);
        
        const { title, description, start_date, end_date, image} = await req.json();
        
        if (!title || !description || !start_date || !end_date) {
            return sendResponse(400, null, "Missing required fields");
        }
        
        let processedImage = null;
        if (image) {
            processedImage = await uploadImage(image);
        }
        
        console.log("Processing challenge with:", {
            title: title.trim(),
            description: description.trim(),
            group_id: id,
            user_id: "dc29424e-ed34-4128-bb3b-63a584e9c472" // Hard-coded for testing
        });

        await db.insert(Challenges).values({
            title: title.trim(),   
            description: description.trim(),
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            image: processedImage,
            group_id: id,
            user_id
        });

        return sendResponse(200, null, "Challenge created successfully");
        
    } catch (err) {
        const error = err instanceof Error ? err.message : "Internal Server Error";
        console.error("Error creating challenge:", error);
        return sendResponse(500, error, "Internal Server Error");
    }
}