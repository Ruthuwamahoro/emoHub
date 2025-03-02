import { NextRequest, NextResponse} from "next/server";
import { sendResponse } from "@/utils/Responses";

export const POST = async( req:NextRequest, res: NextResponse) => {
    try{
        const { name, description, numberOfUsers } = await req.json();

    } catch(err){
        const error = err instanceof Error ? err.message : 'Internal Server Error';
        return sendResponse(500, error, 'Internal Server Error');
    }
}