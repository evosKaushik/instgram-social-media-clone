import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(16, "Full name must be at most 16 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export { registerSchema };
