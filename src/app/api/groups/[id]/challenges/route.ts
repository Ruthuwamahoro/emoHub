import db from "@/server/db";
import { Challenges, Group } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { uploadImage } from "../../route";

export async function POST(
  request: NextRequest,
  segmentedData: {
    params: Promise<{id: string}>
  }
) {
  try {
    const params = await segmentedData.params;
    const { id } = params;
    const user_id = await getUserIdFromSession();
    
    if (!user_id) {
      return sendResponse(401, null, "Unauthorized");
    }
    
    const existingGroup = await db.query.Group.findFirst({
      where: eq(Group.id, id)
    });
    
    if (!existingGroup) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }
    const body = await request.json();
    
    const {
      title,
      description,
      image,
      start_date,
      end_date,
      total_points
    } = body;

    let processedImage = null;
    if (image) {
      processedImage = await uploadImage(image);
    }
    
    if (!title || !description || !start_date || !end_date || !total_points) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const [newChallenge] = await db.insert(Challenges).values({
      group_id: id,
      user_id,
      title,
      description,
      total_points,
      image: processedImage,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
    }).returning();
    
    return NextResponse.json({
      message: "Challenge created successfully",
      challenge: newChallenge
    }, { status: 201 });
      
  } catch (err) {
    const error = err instanceof Error ? err?.message : "An expected error occured";
    return NextResponse.json(
      { error: "Failed to create challenge", message: error },
      { status: 500 }
    );
  }
}