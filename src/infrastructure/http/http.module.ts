import { Module } from '@nestjs/common'

import { AnswerQuestionUseCase } from '@/src/domain/forum/application/use-cases/answer-question'
import { AuthenticateStudentUseCase } from '@/src/domain/forum/application/use-cases/autenticate-student'
import { CreateQuestionUseCase } from '@/src/domain/forum/application/use-cases/create-question'
import { DeleteQuestionUseCase } from '@/src/domain/forum/application/use-cases/delete-question'
import { EditAnswerUseCase } from '@/src/domain/forum/application/use-cases/edit-answer'
import { EditQuestionUseCase } from '@/src/domain/forum/application/use-cases/edit-question'
import { FetchRecentQuestionsUseCase } from '@/src/domain/forum/application/use-cases/fetch-recent-questions'
import { GetQuestionBySlugUseCase } from '@/src/domain/forum/application/use-cases/get-question-by-slug'
import { RegisterStudentUseCase } from '@/src/domain/forum/application/use-cases/register-student'

import { CryptographyModule } from '../crytography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AnswerQuestionController } from './controllers/answer-controller'
import { AutheticateController } from './controllers/autheticate-controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { DeleteQuestionController } from './controllers/delete.controller'
import { EditAnswerController } from './controllers/edit-answer.controller'
import { EditQuestionController } from './controllers/edit-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AutheticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
  ],
})
export class HttpModule {}
