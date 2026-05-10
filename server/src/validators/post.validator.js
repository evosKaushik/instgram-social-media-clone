import z from "zod";

const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .max(100, "Title too long")
    .optional()
    .or(z.literal("")),

  caption: z
    .string()
    .trim()
    .max(2200, "Caption too long")
    .optional()
    .or(z.literal("")),

  visibility: z.enum(["public", "followers", "private"]).optional(),

  allowComments: z
    .union([z.boolean(), z.string().transform((val) => val === "true")])
    .optional(),

  location: z
    .string()
    .trim()
    .max(100, "Location too long")
    .optional()
    .or(z.literal("")),

  hashtags: z
    .union([
      z.array(z.string()),

      z.string().transform((val) =>
        val
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ])
    .optional(),
});

export { createPostSchema };
