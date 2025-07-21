// src/infra/env.ts
import { z } from "zod";
var envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_BUCKET: z.string(),
  CLOUDFLARE_PUBLIC_URL: z.string().url()
});
var env = envSchema.parse(process.env);

export {
  env
};
