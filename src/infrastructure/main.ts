import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { envApi } from './env/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableShutdownHooks()

  await app.listen(envApi.PORT)
}
bootstrap()
