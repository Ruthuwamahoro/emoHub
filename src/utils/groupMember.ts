import db from "@/server/db";
import { Group, GroupMember, Role, User } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getUsersByGroupId(groupId: string){
  try {
    const usersInGroup = await db
      .select({
        id: User.id,
        email: User.email,
        fullName: User.fullName,
        username: User.username,
        profilePicUrl: User.profilePicUrl,
        gender: User.gender,
        bio: User.bio,
        expertise: User.expertise,
        location: User.location,
        isVerified: User.isVerified,
        joinedAt: GroupMember.joined_at,
      })
      .from(GroupMember)
      .innerJoin(User, eq(GroupMember.user_id, User.id))
      .where(eq(GroupMember.group_id, groupId));

    return usersInGroup;
  } catch (error) {
    return error;
  }
}


export interface GroupUser {
  id: string;
  email: string;
  fullName: string;
  username: string;
  profilePicUrl: string | null;
  gender: string | null;
  bio: string | null;
  expertise: string | null;
  location: string | null;
  isVerified: boolean | null;
  joinedAt: Date | null;
}


export async function getAllUsersInGroup(groupId: string) {
  const users = await db
    .select({
      id: User.id,
      email: User.email,
      fullName: User.fullName,
      username: User.username,
      profilePicUrl: User.profilePicUrl,
      role: {
        name: Role.name
      },
      bio: User.bio,
      isVerified: User.isVerified,
      joinedAt: GroupMember.joined_at,
    })
    .from(GroupMember)
    .innerJoin(User, eq(GroupMember.user_id, User.id))
    .innerJoin(Role, eq(User.role, Role.id))
    .where(eq(GroupMember.group_id, groupId));

  return users;
}