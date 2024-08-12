import { z } from 'zod'

export const envSchema = z.object({
  MODE: z.enum(['production', 'development', 'test']),
  API_URL: z.string(),
  NSTECH_ZEUS_COMPONENT: z.string(),
  NSTECH_ZEUS_UTILS: z.string()
})

export const env = envSchema.parse(process.env)