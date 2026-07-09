import { OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { envApi } from '@src/infrastructure/env/env'

export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: envApi.DATABASE_URL,
    })
    super({
      adapter,
      log:
        envApi.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
      errorFormat: 'pretty',
    })
  }

  onModuleInit() {}

  onModuleDestroy() {
    return this.$disconnect()
  }
}
