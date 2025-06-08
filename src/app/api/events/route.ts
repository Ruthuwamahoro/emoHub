// API routes for emotional intelligence events management

import db from "@/server/db";
import { Event } from "@/server/db/schema";
import { checkIfUserIsAdmin } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    try {

        const isUserAdmin =  await checkIfUserIsAdmin();
        if(!isUserAdmin) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const { title, description, date, time, location } = await req.json();

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
        return sendResponse(400, null, "Invalid date format");
        }

        await db.insert(Event).values({
            title,
            description,
            date: parsedDate,
            time,
            location,
        })
        return sendResponse(200, null, 'Event created successfully');
    } catch (error) {

        const err = error instanceof Error ? error?.message : "Internal Server Error";
        return sendResponse(500, null, err); 
    }
}

export async function GET (req: NextRequest){
    try {
        const events = await db.select().from(Event);
        return sendResponse(200, events, 'Events fetched successfully');
    } catch (error) {
        const err = error instanceof Error ? error?.message : "Internal Server Error";
        return sendResponse(500, null, err); 
    }
}