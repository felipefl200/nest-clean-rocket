import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { z } from 'zod'

const certificatePathSchema = z
  .string()
  .trim()
  .min(1)
  .transform((path) => resolve(process.cwd(), path))
  .refine((path) => existsSync(path), {
    message: 'Arquivo de certificado não encontrado',
  })

const privateKeyPathSchema = certificatePathSchema.transform((path, ctx) => {
  const content = readFileSync(path, 'utf-8')

  if (
    !content.includes('-----BEGIN PRIVATE KEY-----') ||
    !content.includes('-----END PRIVATE KEY-----')
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'Arquivo não contém uma chave privada PEM válida',
    })

    return z.NEVER
  }

  return content
})

const publicKeyPathSchema = certificatePathSchema.transform((path, ctx) => {
  const content = readFileSync(path, 'utf-8')

  if (
    !content.includes('-----BEGIN PUBLIC KEY-----') ||
    !content.includes('-----END PUBLIC KEY-----')
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'Arquivo não contém uma chave pública PEM válida',
    })

    return z.NEVER
  }

  return content
})

const postgresUrlSchema = z
  .url('DATABASE_URL deve ser uma URL válida')
  .trim()
  .min(1, 'DATABASE_URL é obrigatória')
  .refine((url) => url.startsWith('postgresql://') || url.startsWith('postgres://'), {
    message: 'DATABASE_URL deve começar com postgresql:// ou postgres://',
  })

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  POSTGRES_DB: z.string().min(1, 'POSTGRES_DB é obrigatória'),
  POSTGRES_USER: z.string().min(1, 'POSTGRES_USER é obrigatória'),
  POSTGRES_PASSWORD: z.string().min(1, 'POSTGRES_PASSWORD é obrigatória'),
  POSTGRES_PORT: z.coerce.number().int().positive().default(5432),

  JWT_PRIVATE_KEY_PATH: privateKeyPathSchema,
  JWT_PUBLIC_KEY_PATH: publicKeyPathSchema,
  JWT_EXPIRES_IN: z.string().default('15m'),

  PORT: z.coerce.number().int().positive().default(3001),
  BCRYPT_COST: z.coerce
    .number()
    .int()
    .min(10, 'BCRYPT_COST deve ser no mínimo 10 para bcrypt')
    .max(14, 'BCRYPT_COST acima de 14 pode degradar severamente a autenticação')
    .default(12),

  DATABASE_URL: postgresUrlSchema,

  CLOUDFLARE_ACCOUNT_ID: z.string().trim().min(1, 'CLOUDFLARE_ACCOUNT_ID é obrigatória'),
  AWS_BUCKET_NAME: z.string().trim().min(1, 'AWS_BUCKET_NAME é obrigatória'),
  AWS_ACCESS_KEY_ID: z.string().trim().min(1, 'AWS_ACCESS_KEY_ID é obrigatória'),
  AWS_SECRET_ACCESS_KEY: z.string().trim().min(1, 'AWS_SECRET_ACCESS_KEY é obrigatória'),
})

export type Env = z.infer<typeof envSchema>
