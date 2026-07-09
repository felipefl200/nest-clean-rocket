import z from 'zod'

import { envSchema } from './env-schema'

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables')

  console.error(
    parsedEnv.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  )
  process.exit(1)
}

export const envApi = parsedEnv.data
export type Env = z.infer<typeof envSchema>
