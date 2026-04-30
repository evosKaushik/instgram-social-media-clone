import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  ACCESS_TOKEN_SECRET: z.string().min(6, "JWT_SECRET too short"),
  REFRESH_TOKEN_SECRET: z.string().min(6, "JWT_SECRET too short"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
});

export { envSchema };
