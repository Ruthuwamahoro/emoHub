import { NextRequest } from "next/server";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import db from "@/server/db";
import { Todo } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return sendResponse(401, null, "Unauthorized");
    }

    const data = await req.json();

    if (!data.title || !data.dueDate) {
      return sendResponse(400, null, "Title and due date are required");
    }

    const dueDate = new Date(data.dueDate);
    if (dueDate < new Date()) {
      return sendResponse(400, null, "Due date cannot be in the past");
    }

    const todo = await db
      .insert(Todo)
      .values({
        userId,
        title: data.title,
        description: data.description,
        priority: data.priority || "MEDIUM",
        status: "PENDING",
        dueDate: dueDate,
        reminderSet: data.reminderSet || false,
        reminderTime: data.reminderTime ? new Date(data.reminderTime) : null,
        category: data.category,
        tags: data.tags || [],
      })
      .returning();

    return sendResponse(200, todo[0], "Todo created successfully");
  } catch (error) {
    return sendResponse(500, null, "Failed to create todo");
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return sendResponse(401, null, "Unauthorized");
    }

    const todos = await db
      .select()
      .from(Todo)
      .where(eq(Todo.userId, userId))
      .orderBy(desc(Todo.createdAt));

    return sendResponse(200, todos, "Todos retrieved successfully");
  } catch (error) {
    return sendResponse(500, null, "Failed to retrieve todos");
  }
}
