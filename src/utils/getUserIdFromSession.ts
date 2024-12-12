import { getServerSession } from "next-auth";

import { options } from "@/auth";

export async function getUserIdFromSession(): Promise<string | null> {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user?.id) {
      console.error("Unauthorized: No valid session or user ID found.");
      return null;
    }

    return session.user.id;
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
}

