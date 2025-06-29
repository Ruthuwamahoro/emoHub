// API routes for exiting the group

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

    await db
      .delete(GroupMember)
      .where(
        and(eq(GroupMember.user_id, userId), eq(GroupMember.group_id, group_id))
      );

    return NextResponse.json(
      { status: HttpStatusCode.Ok, message: "Left group successfully" },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: HttpStatusCode.InternalServerError,
        message: (error as Error).message,
      },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
