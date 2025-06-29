import { getAllUsersInGroup } from "@/utils/groupMember";
import { sendResponse } from "@/utils/Responses";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
  try {
    const { id } = await params;
    const groupId = id;
    const users = await getAllUsersInGroup(groupId);
    return sendResponse(200, users, 'Members returned successfully')
  } catch (error) {

    return sendResponse(500, null, 'Failed to fetch group users')
  }
}