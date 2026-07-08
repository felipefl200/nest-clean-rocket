import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

import { PrismaClient } from '../src/infrastructure/database/generated/client'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL não definida para os testes')
}

if (!connectionString.includes('_test')) {
  throw new Error('DATABASE_URL de teste deve apontar para um banco exclusivo de teste')
}

export const testPool = new Pool({
  connectionString,
})

const adapter = new PrismaPg(testPool)

export const prismaTestClient = new PrismaClient({
  adapter,
})

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`
}

export async function cleanDatabase() {
  const tables = await prismaTestClient.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename <> '_prisma_migrations'
  `

  if (tables.length === 0) {
    return
  }

  const tableNames = tables
    .map(({ tablename }) => `"public".${quoteIdentifier(tablename)}`)
    .join(', ')

  await prismaTestClient.$executeRawUnsafe(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`)
}

export async function disconnectTestDatabase() {
  await prismaTestClient.$disconnect()
  await testPool.end()
}
