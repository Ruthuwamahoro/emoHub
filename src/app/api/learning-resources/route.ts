import db from "@/server/db";
import { learningResources } from "@/server/db/schema";
import { getYoutubeData } from "@/utils/getYoutubeData";
import { sendResponse } from "@/utils/Responses";
import { NextRequest } from "next/server";
import { desc, is } from "drizzle-orm";
import { checkIfUserIsAdmin, checkIfUserIsSpecialists, checkIfUserIsSuperAdmin, getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { uploadImage } from "@/utils/cloudinary";

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
      return sendResponse(401, null, "Unauthorized");
    }
    const body = await req.json();
    let coverImage = null;
    if(body.coverImage){
      coverImage = await uploadImage(body.coverImage);
    }
    const now = new Date();
    const insertData = {
      ...body,
      userId,
      coverImage,
      createdAt: now,
      updatedAt: now,
    };

    if (body.url && (body.url.includes("youtube.com") || body.url.includes("youtu.be"))) {
      const youtubeMeta = await getYoutubeData(body.url);
      if (youtubeMeta) {
        insertData.title = body.title || youtubeMeta.title;
        insertData.description = body.description || youtubeMeta.description;
        insertData.thumbnailUrl = youtubeMeta.thumbnailUrl;
        insertData.duration = body.duration || youtubeMeta.duration;
      }
    }

    await db.insert(learningResources).values(insertData).returning();
    return sendResponse(200, null, "Learning resource created successfully");

  } catch (error) {
    const err = error instanceof Error ? error.message : "Internal Server Error";
    return sendResponse(500, null, err);
  }
};

export const GET = async(req: NextRequest) => {
    try {
        const allResources = await db.select().from(learningResources).orderBy(desc(learningResources.createdAt)).execute();
        return sendResponse(200, allResources, 'Learning resources fetched successfully');
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err); 
    }
}
