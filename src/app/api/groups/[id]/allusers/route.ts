import { NextResponse, NextRequest } from "next/server";
import { Group, User, GroupMember } from "@/server/db/schema";
import db from "@/server/db";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { emit } from "process";
import { userIsGroupMember } from "@/utils/userIsGroupMember";

export async function  GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){

  const { id } = await params;
    const groupId = id;
    if (!groupId) {
        return sendResponse(400, null, "Group ID is required");
    }

    const userAuth = await userIsGroupMember(groupId);
    if (!userAuth) {
        return sendResponse(401, null, "Unauthorized");
    }

  try {
    const groupUsers = await db
      .select({
        id: User.id,
        name: User.fullName,
        username: User.username,
        email: User.email,
        profilePic: User.profilePicUrl,
        joinedAt: GroupMember.joined_at,
      })
      .from(GroupMember)
      .innerJoin(User, eq(GroupMember.user_id, User.id))
      .where(eq(GroupMember.group_id, groupId))
      .orderBy(User.fullName);

    return sendResponse(200, groupUsers, "Group members fetched successfully");
  } catch (error) {
    const err =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return sendResponse(500, null, err);
  }
};
