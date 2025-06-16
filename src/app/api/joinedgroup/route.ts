import db from "@/server/db";
import { Group,GroupMember } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json(
        { status: 401, data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userForums = await db
      .select({
        forumName: Group.name,
        joinedAt: GroupMember.joined_at,
      })
      .from(GroupMember)
      .innerJoin(Group, eq(GroupMember.group_id, Group.id))
      .where(eq(GroupMember.user_id, userId));


    return NextResponse.json(
      { status: 200, data: userForums, message: "User forums retrieved successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { status: 500, message: err.message, data: null },
      { status: 500 }
    );
  }
}

