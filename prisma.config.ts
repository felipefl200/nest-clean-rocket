import { loadEnvFile } from 'node:process'

import { defineConfig } from 'prisma/config'

import { envSchema } from './src/infrastructure/env/env-schema'

loadEnvFile('.env')

const env = envSchema.pick({ DATABASE_URL: true }).parse(process.env)

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env.DATABASE_URL,
  },
})
