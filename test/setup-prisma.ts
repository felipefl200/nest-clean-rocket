import { afterAll, beforeEach } from 'vitest'

import { cleanDatabase, disconnectTestDatabase } from './prisma-test-client'

beforeEach(async () => {
  await cleanDatabase()
})

afterAll(async () => {
  await disconnectTestDatabase()
})
