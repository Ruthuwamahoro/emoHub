import { getServerSession } from "next-auth";

import { options } from "@/auth";
import db from "@/server/db";
import { Role, User } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getUserIdFromSession(): Promise<string | null> {
  try {
    const session = await getServerSession(options);
    if (!session || !session.user?.id) {
      return null;
    }

    return session.user.id;
  } catch (error) {
    return null;
  }
}
export async function checkIfUserIsAdmin(): Promise<boolean> {
  const userId = await getUserIdFromSession();
  
  if (!userId) {
    return false;
  }
  
  try {
    const user = await db.select().from(User).where(eq(User.id, userId)).limit(1);
    
    if (user.length === 0) {
      return false;
    }
    
    if (!user[0].role) {
      return false;
    }

    const userRole = await db
      .select()
      .from(Role)
      .where(eq(Role.id, user[0].role as string))
      .limit(1);
    
    if (userRole.length === 0) {
      return false;
    }
    return userRole[0].name === "Admin";
  } catch (error) {
    return false;
  }
}