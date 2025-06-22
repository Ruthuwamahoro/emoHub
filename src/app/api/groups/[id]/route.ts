import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/server/db";
import { Group } from "@/server/db/schema";
import { checkIfUserIsSpecialists, checkIfUserIsAdmin, checkIfUserIsSuperAdmin, getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";

export async function GET(
  request: NextRequest,
  segmentedData: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = await getUserIdFromSession();
    
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const params = await segmentedData.params;
    const groupId = params.id;
    
    const [group] = await db.select()
      .from(Group)
      .where(eq(Group.id, groupId))
      .limit(1);
    
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    
    return NextResponse.json({status: 200,
        group,
    message: "Group details fetched successfully"});
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch group details" }, { status: 500 });
  }
}


export async function PATCH(
  request: NextRequest,
  segmentedData: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = await getUserIdFromSession();
    const body = await request.json();
    
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const params = await segmentedData.params;
    const groupId = params.id;
    
    const [group] = await db.select()
      .from(Group)
      .where(eq(Group.id, groupId))
      .limit(1);
    
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const newInsertedData = {
      ...body,
      updatedAt: new Date()
    }
    
    await db.update(Group).set(newInsertedData).where(eq(Group.id, groupId))
    return sendResponse(200, null, "Group updated successfully");
    
  } catch (error) {
    return sendResponse(500, null, error instanceof Error ? error?.message : 'Unexpected error occured');

  }
}



export async function DELETE(
  request: NextRequest,
  segmentedData: { params: Promise<{ id: string }> }
) {
  try {
    const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
      checkIfUserIsAdmin(),
      checkIfUserIsSpecialists(),
      checkIfUserIsSuperAdmin()
    ])

    const isAuthorized = isAdmin || isSpecialists || isSuperAdmin;
    const userId = await getUserIdFromSession();

    if(!isAuthorized || !userId){
      return sendResponse(401, null, "Unauthorized");
    }


    const params = await segmentedData.params;
    const groupId = params.id;
    const existingGroup = await db.select().from(Group).where(eq(Group.id, groupId));
    if(existingGroup.length === 0){
      return sendResponse(400, null, "Group not found")
    }
    
    await db.delete(Group).where(eq(Group.id, groupId));
    
    return sendResponse(200, null, "Group deleted successfully");
    
  } catch (error) {
    return sendResponse(500, null, error instanceof Error ? error?.message : 'Unexpected error occured');
  }
}


