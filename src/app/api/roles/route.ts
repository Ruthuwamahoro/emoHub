import { Role } from '@/server/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import  db  from '@/server/db/index';
import { sendResponse } from '@/utils/Responses';

export async function POST(request: NextRequest){
  try {
    const data = await request.json();
    const { name, description } = data;
    const Name = name.trim();
    const checkIfRoleExists = await db
      .select()
      .from(Role)
      .where(eq(Role.name, Name));
    if (checkIfRoleExists.length > 0) {
      return sendResponse(409, null, 'Role already exists');
    }
    await db.insert(Role).values({ name: Name, description });
    return sendResponse(201, null, 'Role Created Successfully');
  } catch (err: unknown) {
    const error = err as Error;
    return sendResponse(500, error.message, 'Internal Server Error');
  }
};

export const GET = async () => {
  try {
    const users = await db.select().from(Role);
    return sendResponse(200, users, 'All roles retrieved successfully');
  } catch (err: unknown) {
    const error = err as Error;
    return sendResponse(500, error.message, 'Error in getting role');
  }
};
