import db from "@/server/db";
import { DailyReflections, DailyReflectionsResponse, User } from "@/server/db/schema";
import { checkIfUserIsAdmin, checkIfUserIsSpecialists, checkIfUserIsSuperAdmin, getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
export async function GET (req: NextRequest){
  console.log("Fetching reflections overview...");
    const userId = await getUserIdFromSession();
    if (!userId) {
      return sendResponse(401, null, "Unauthorized");
    }
    const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
      checkIfUserIsAdmin(),
      checkIfUserIsSpecialists(),
      checkIfUserIsSuperAdmin()
    ]);
    const checkRole = isAdmin || isSpecialists || isSuperAdmin;
    
    try {
      if(checkRole){
          const reflections = await db.select({
              title: DailyReflections.reflectionQuestion,
              responder: {
                  userName: User.username,
              },
              response: DailyReflectionsResponse.response,
              responseDate: DailyReflectionsResponse.createdAt,

          })
          .from(DailyReflections)  
          .innerJoin(DailyReflectionsResponse, eq(DailyReflections.id, DailyReflectionsResponse.reflectionId))
          .innerJoin(User, eq(DailyReflectionsResponse.userId, User.id))          
          .where(eq(DailyReflections.userId, userId));
          if (reflections.length === 0) {
              return sendResponse(404, null, 'No reflections found for the user');
            }

          return sendResponse(200, reflections, 'Reflections retrieved successfully');
      }
      const userResponse = await db.select({
          title: DailyReflections.reflectionQuestion,
          response: DailyReflectionsResponse.response,
          responseDate: DailyReflectionsResponse.createdAt,
      }).from(DailyReflections)
        .innerJoin(DailyReflectionsResponse, eq(DailyReflections.id, DailyReflectionsResponse.reflectionId)).orderBy(desc(DailyReflectionsResponse.createdAt))
        .where(eq(DailyReflectionsResponse.userId, userId));
      if (userResponse.length === 0) {
        return sendResponse(404, null, 'No reflections found for the user');
      }
      return sendResponse(200, userResponse, 'Reflections retrieved successfully');
    } catch (error) {
      return sendResponse(500, null, error instanceof Error ? error.message : 'An unexpected error occurred');
    }

}