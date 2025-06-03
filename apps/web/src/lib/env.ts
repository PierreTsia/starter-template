import { z } from 'zod';

const envSchema = z.object({
  // API
  VITE_API_URL: z.string().url(),

  // Auth
  VITE_AUTH_TOKEN_KEY: z.string().default('token'),

  // Feature Flags
  VITE_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
});

// This is safe to use in the browser because Vite only exposes VITE_* variables
export const env = envSchema.parse(import.meta.env);

// Type for the validated environment variables
export type Env = z.infer<typeof envSchema>;
