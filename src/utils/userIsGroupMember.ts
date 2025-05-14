import { GroupMember } from "@/server/db/schema";
import db from "@/server/db";
import { and, eq } from "drizzle-orm";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";

export async function userIsGroupMember(groupId: string): Promise<boolean> {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return false;
  }
  if (!groupId) {
    return false;
  }

  try {
    const member = await db
      .select()
      .from(GroupMember)
      .where(
        and(eq(GroupMember.user_id, userId), eq(GroupMember.group_id, groupId))
      )
      .limit(1);

    return member.length > 0;
  } catch (error) {
    console.error("Error checking group membership:", error);
    return false;
  }
}
