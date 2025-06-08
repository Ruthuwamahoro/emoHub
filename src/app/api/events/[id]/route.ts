// API routes for emotional intelligence events management

import db from "@/server/db";
import { Event } from "@/server/db/schema";
import { checkIfUserIsAdmin } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server"

export async function  GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ){
    try {

        const { id } = await params;
        const eventId = id;
        const event = await db.select().from(Event).where(eq(Event.id, eventId)).execute();
        if (event.length === 0) {
            return sendResponse(404, null, 'Event not found');
        }
        return sendResponse(200, event[0], 'Event fetched successfully');
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);   
    }
}

export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {

        const isUserAdmin = await checkIfUserIsAdmin();
        if (!isUserAdmin) {
        return sendResponse(401, null, "Unauthorized");
        }
        const { id } = await params;
        const eventId = id;
        const body = await req.json();
        const updateData = {
            ...body,
            updated_at: new Date(),
        };
        await db.update(Event).set(updateData).where(eq(Event.id, eventId)).returning();
        return sendResponse(200, null, 'Event updated successfully');

    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);   
    }

}
export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const isUserAdmin = await checkIfUserIsAdmin();
        if (!isUserAdmin) {
        return sendResponse(401, null, "Unauthorized");
        }
        const { id } = await params;
        const eventId = id;
        await db.delete(Event).where(eq(Event.id, eventId)).returning();
        return sendResponse(200, null, 'Event deleted successfully');
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);   
    }

}