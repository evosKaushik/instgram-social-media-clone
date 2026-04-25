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
  JWT_SECRET: parsed.data.JWT_SECRET,
  NODE_ENV: parsed.data.NODE_ENV,
};
