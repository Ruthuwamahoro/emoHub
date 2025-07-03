import cloudinary from "cloudinary";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import { User } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { HttpStatusCode } from "axios";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const PATCH = async (req: NextRequest) => {
  const userId = await getUserIdFromSession();
  console.log("userId", userId);

  if (!userId) {
    return NextResponse.json(
      { status: 401, message: "Unauthorized", data: null },
      { status: HttpStatusCode.Unauthorized }
    );
  }
  const body = await req.json();
  if (body instanceof NextResponse) {
    return body;
  }

  
  if (Object.keys(body).length === 0) {
    return NextResponse.json(
      { status: 400, message: "No fields provided to update!", data: null },
      { status: HttpStatusCode.Unauthorized }
    );
  }

  try {
    const user = await db
      .select()
      .from(User)
      .where(eq(User.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { status: 404, message: "User not found", data: null },
        { status: HttpStatusCode.NotFound }
      );
    }

    const updateData = {
      ...body,
    };

    console.log("jiji----------", updateData)


    await db.update(User).set(updateData).where(eq(User.id, userId));

    return NextResponse.json(
      { status: 200, message: "Profile Completed successfully", data: null },
      { status: HttpStatusCode.Accepted }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { status: 500, message: "Error occurred", data: null },
      { status: HttpStatusCode.InternalServerError }
    );
  }
};
