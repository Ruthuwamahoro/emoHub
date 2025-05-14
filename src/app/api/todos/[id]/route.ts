import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession } from '@/utils/getUserIdFromSession';
import { sendResponse } from '@/utils/Responses';
import db from '@/server/db';
import { Todo } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const PATCH = async (req: NextRequest, 
    segmentedData: {
        params: {
            id: string;
        }
    }
) => {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return sendResponse(401, null, 'Unauthorized');
    }
    try {
        const todoId = await segmentedData.params.id;
        const body = await req.json();
        const updateData = {
            ...body,
            updated_at: new Date(),
            updated_by: userId!,
        };
        await db.update(Todo).set(updateData).where(eq(Todo.id, todoId)).returning();
        return sendResponse(200, null, 'Todo updated successfully');

    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);   
    }

}

export const DELETE = async (
    req: NextRequest, 
    segmentedData: {
        params: {
            id: string;
        }
    }
) => {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return sendResponse(401, null, 'Unauthorized');
    }
    try {
        const todoId = await segmentedData.params.id;
        await db.delete(Todo).where(eq(Todo.id, todoId)).returning();
        return sendResponse(200, null, 'Todo deleted successfully');
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);   
    }

}