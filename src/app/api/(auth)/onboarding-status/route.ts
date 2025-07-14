import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession } from '@/utils/getUserIdFromSession';

import db from "@/server/db";
import { eq } from "drizzle-orm";
import { User } from "@/server/db/schema";

export const isOnboardingCompleted = async(userId: string): Promise<boolean> => {
    try {
        const user = await db.select().from(User).where(eq(User.id, userId)).limit(1);
        if (user.length === 0) {
        return false; 
        }
        
        return user[0].onboardingCompleted || false; 
    } catch (error) {
        console.error("Error checking onboarding status:", error);
        return false;
    }
}
export async function GET(request: NextRequest) {
  try {
    const userId= await getUserIdFromSession();
    
    if (userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isCompleted = await isOnboardingCompleted(userId as string);
    
    return NextResponse.json({ isCompleted });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}