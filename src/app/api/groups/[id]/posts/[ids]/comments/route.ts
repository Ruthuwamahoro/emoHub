import { Comment } from "@/server/db/schema";
import db from "@/server/db";
import { NextRequest } from "next/server";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";

export const POST = async(
    req: NextRequest,
    segmentedData: {
        params: {
            ids: string;
        }
    }
) => {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        const postId = await segmentedData.params.ids;
        if (!postId) {
            return new Response(JSON.stringify({ error: "Post ID is required" }), { status: 400 });
        }
        const { content } = await req.json();
        if (!content) {
            return new Response(JSON.stringify({ error: "Content is required" }), { status: 400 });
        }
        await db.insert(Comment).values({
            content,
            postId,
            userId,
        }).returning();

        return sendResponse(200, null, "Comment created successfully");

    } catch (error) {
        return sendResponse(500, null, "Internal Server Error");
    }
}

export const GET = async() => {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return sendResponse(401, null, "Unauthorized");
        }
        const allComments = await db.select().from(Comment);
        if (!allComments) {
            return new Response(JSON.stringify({ error: "No comments found" }), { status: 404 });
        }
        return sendResponse(200, allComments, "Comments fetched successfully");

    } catch (error) {
        return sendResponse(500, null, "Internal Server Error");
    }
}