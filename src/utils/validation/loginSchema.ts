import { z } from "zod";
import { passwordSchema } from "./passwordSchema";

export const loginSchema = z.object({
  email: z.string().email("Invalid Email").nonempty("Email is required"),
  password_hash: passwordSchema,
});