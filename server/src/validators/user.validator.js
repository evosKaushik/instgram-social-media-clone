import z from "zod";

const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(16, "Full name must be at most 16 characters")
      .optional(),
    // username: z
    //   .string()
    //   .min(3, "Username must be at least 3 characters")
    //   .max(20, "Username must be at most 20 characters")
    //   .regex(
    //     /^(?!_)(?!.*__)[a-zA-Z0-9_]{3,20}(?<!_)$/,
    //     "Invalid username format",
    //   )
    //   .optional(),
    // email: z.string().email("Invalid email address").optional(),
    bio: z.string().optional(),

    isPrivate: z.boolean().optional(),
  })
  .strict();

const changePasswordSchema = z.object({
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
}).strict();

export { updateUserSchema, changePasswordSchema };
