import { NextResponse, NextRequest } from "next/server";
import { sendResponse } from "@/utils/Responses";
import db from "@/server/db/index";
import { GroupCategories } from "@/server/db/schema";



export const POST = async (req: NextRequest, res: NextResponse) => {
    try{
        const { name, description} = await req.json()
        if(!name || !description){
            return sendResponse(400, null, 'Name and Description are required')
        }
        await db.insert(GroupCategories).values({name, description})
        return sendResponse(201, null, 'Category Created Successfully')
    } catch(err){
        const error = err instanceof Error ? err.message : 'Internal Server Error';
        return sendResponse(500, error, 'Internal Server Error')
    }
}