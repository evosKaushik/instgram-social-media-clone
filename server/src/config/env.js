import dotenv from "dotenv";
dotenv.config();

import { envSchema } from "../validators/env.validator.js";

// Validate
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

// Export clean config
export const ENV = {
  PORT: Number(parsed.data.PORT),
  MONGO_URI: parsed.data.MONGO_URI,
  NODE_ENV: parsed.data.NODE_ENV,
  ACCESS_TOKEN_SECRET: parsed.data.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: parsed.data.REFRESH_TOKEN_SECRET,
  CLOUDINARY_CLOUD_NAME: parsed.data.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: parsed.data.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: parsed.data.CLOUDINARY_API_SECRET,
};
