import { Module } from '@nestjs/common'
import { AuthenticateStudentUseCase } from '@src/domain/forum/application/use-cases/autenticate-student'
import { CreateQuestionUseCase } from '@src/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@src/domain/forum/application/use-cases/fetch-recent-questions'
import { RegisterStudentUseCase } from '@src/domain/forum/application/use-cases/register-student'

import { CryptographyModule } from '../crytography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AutheticateController } from './controllers/autheticate-controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AutheticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
  ],
})
export class HttpModule {}
