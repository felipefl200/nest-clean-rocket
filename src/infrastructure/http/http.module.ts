import { Module } from '@nestjs/common'
import { CreateQuestionUseCase } from '@src/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@src/domain/forum/application/use-cases/fetch-recent-questions'

import { DatabaseModule } from '../database/database.module'
import { AutheticateController } from './controllers/autheticate-controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AutheticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [CreateQuestionUseCase, FetchRecentQuestionsUseCase],
})
export class HttpModule {}
