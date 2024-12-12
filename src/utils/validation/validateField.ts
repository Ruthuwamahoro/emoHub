import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerSchema } from "./registerFieldValidation";
import { UserInterface } from "@/types/user";

const validateData = async <T>(req: NextRequest, schema: z.Schema<T>) => {
    try{
        const data: T = await req.json();
        await schema.parseAsync(data);
        return data;

    } catch(err: unknown){
        const error = err as Error;
        if(error instanceof z.ZodError){
            const validationMessages = error.errors.map(error => `${error.path} is ${error.message}`);
            console.log("validationMessages", validationMessages);
            return NextResponse.json({ data: null,message: validationMessages, error: "Validation error occurred" }, { status: 400 });
        }
        throw error;
    }

}

export const validateRegisterData = (req: NextRequest) => validateData<UserInterface>(req, registerSchema);