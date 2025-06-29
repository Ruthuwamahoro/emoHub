import { NextRequest, NextResponse } from "next/server";
import { sendResponse } from "@/utils/Responses";
import db from "@/server/db";
import { Group, GroupMember} from "@/server/db/schema";
import { uploadImage } from "@/utils/cloudinary";
import { checkIfUserIsAdmin, checkIfUserIsSpecialists, checkIfUserIsSuperAdmin, getUserIdFromSession } from "@/utils/getUserIdFromSession";


export const POST = async (req: NextRequest) => {
  try {
    const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
      checkIfUserIsAdmin(),
      checkIfUserIsSpecialists(),
      checkIfUserIsSuperAdmin()
    ])

    const isAuthorized = isAdmin || isSpecialists || isSuperAdmin;
    const userId = await getUserIdFromSession();
    if(!isAuthorized || !userId){
        return sendResponse(401, 'Unauthorized', 'You are not authorized to perform this action')
    }
    const { name, categoryId, description, image } = await req.json();
    if (!name || !categoryId || !description) {
      return sendResponse(
        400,
        "Bad Request",
        "Please provide all the required fields"
      );
    }

    let processedImage = null;
    if (image) {
      processedImage = await uploadImage(image);
    }
    
    const [insertedGroup] = await db.insert(Group).values({
      name,
      categoryId,
      description,
      userId,
      image: processedImage,
    }).returning();

    await db.insert(GroupMember).values({
      user_id: userId,
      group_id: insertedGroup.id,
      joined_at: new Date(),
    });
    
    return sendResponse(200, null, "Group Created Successfully");
  } catch (err) {
    const error = err instanceof Error ? err.message : "Internal Server Error";
    return sendResponse(500, error, "Internal Server Error");
  }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const groups = await db.query.Group.findMany({
      with: {
        category: true,
        members: {
          with: {
            user: true 
          }
        },
        creator: true 
      }
    });

    const groupsWithJoinStatusAndCount = groups.map(group => {
      const memberCount = group.members ? group.members.length : 0;
      const isJoined = userId ? 
        group.members?.some(member => member.user_id === userId) : 
        false;

      return {
        ...group,
        memberCount,
        isJoined
      };
    });

    return NextResponse.json({
      data: groupsWithJoinStatusAndCount,
      status: 200
    });
  } catch (error) {

    return NextResponse.json(
      {
        error: "Failed to fetch groups",
        details: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : 'Unknown error'
      },
      { status: 500 }
    );
  }
}