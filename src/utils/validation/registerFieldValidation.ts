import { z } from "zod";
import { passwordSchema } from "./passwordSchema";
export const registerSchema = z.object({
    fullName: z.string().nonempty("Full name is required").min(5, {message: "Must be 5 or more characters long"}),
    username: z.string().nonempty("Username is required").min(8, {message: "username should be 8 or more characters long"}),
    email: z.string().nonempty("Email address is required").email("email is invalid"),
    password_hash: passwordSchema
})

export type RegisterSchema = z.infer<typeof registerSchema> 