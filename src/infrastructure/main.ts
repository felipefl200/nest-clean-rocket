import { NestFactory } from '@nestjs/core'

import { envApi } from '../env/env'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableShutdownHooks()

  await app.listen(envApi.PORT)
}
bootstrap()
