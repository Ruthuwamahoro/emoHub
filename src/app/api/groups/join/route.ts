import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import db from "@/server/db";
import { GroupMember } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json(
        { status: HttpStatusCode.Unauthorized, message: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const { group_id } = await req.json();

    // Check if already a member
    const existingMember = await db.query.GroupMember.findFirst({
      where: (member) => {
        return and(eq(member.user_id, userId), eq(member.group_id, group_id));
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { status: HttpStatusCode.Conflict, message: "Already a member" },
        { status: HttpStatusCode.Conflict }
      );
    }

    // Join group
    await db.insert(GroupMember).values({
      user_id: userId,
      group_id: group_id,
      joined_at: new Date(),
    });

    return NextResponse.json(
      { status: HttpStatusCode.Ok, message: "Joined successfully" },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json(
      {
        status: HttpStatusCode.InternalServerError,
        message: (error as Error).message,
      },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}