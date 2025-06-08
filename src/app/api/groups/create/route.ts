//API endpoints for creating the group
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import db from "@/server/db";
import { Group, GroupMember } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json(
        { status: HttpStatusCode.Unauthorized, message: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const { name, description, categoryId, image } = await req.json();

    const [newGroup] = await db
      .insert(Group)
      .values({
        name,
        description,
        categoryId,
        image,
        userId: userId,
      })
      .returning();

    await db.insert(GroupMember).values({
      user_id: userId,
      group_id: newGroup.id,
      joined_at: new Date(),
    });

    return NextResponse.json(
      {
        status: HttpStatusCode.Created,
        data: newGroup,
        message: "Group created successfully",
      },
      { status: HttpStatusCode.Created }
    );
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      {
        status: HttpStatusCode.InternalServerError,
        message: (error as Error).message,
      },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
