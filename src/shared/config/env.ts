import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url('VITE_API_URL must be a valid URL'),
  VITE_MAIN_APP_URL: z
    .string()
    .url('VITE_MAIN_PLATFORM_URL must be a valid URL'),
  VITE_APP_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

// Validate environment variables at runtime
const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables. Check your .env file.');
}

export const env = parsedEnv.data;
