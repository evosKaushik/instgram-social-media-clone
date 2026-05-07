import z from "zod";

const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(16, "Full name must be at most 16 characters")
      .optional(),
    bio: z.string().optional(),
    isPrivate: z.boolean().optional(),
    gender: z.enum(["male", "female", "prefer not to say"]).optional(),
  })
  .strict();

const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be at most 100 characters")
      .optional(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be at most 100 characters")
      .optional(),
  })
  .strict();

export { updateUserSchema, changePasswordSchema };
