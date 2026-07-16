import { afterAll, beforeAll, beforeEach } from 'vitest'

import { cleanDatabase, disconnectTestDatabase, prismaTestClient } from './prisma-test-client'

process.env.CLOUDFLARE_ACCOUNT_ID ??= 'test-account-id'
process.env.AWS_BUCKET_NAME ??= 'test-bucket'
process.env.AWS_ACCESS_KEY_ID ??= 'test-access-key'
process.env.AWS_SECRET_ACCESS_KEY ??= 'test-secret-key'

beforeAll(async () => {
  const [result] = await prismaTestClient.$queryRaw<Array<{ usersTable: string | null }>>`
    SELECT to_regclass('public.users')::text AS "usersTable"
  `

  if (!result?.usersTable) {
    throw new Error('Banco de testes sem schema. Execute as migrations antes dos testes E2E.')
  }
})

beforeEach(async () => {
  await cleanDatabase()
})

afterAll(async () => {
  await disconnectTestDatabase()
})
