import { Module } from '@nestjs/common'

import { AnswerAttachmentsRepository } from '@/src/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentsRepository } from '@/src/domain/forum/application/repositories/answer-comments-repository'
import { AnswersRepository } from '@/src/domain/forum/application/repositories/answers-repository'
import { QuestionAttachmentsRepository } from '@/src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionCommentsRepository } from '@/src/domain/forum/application/repositories/question-comments-repository'
import { QuestionsRepository } from '@/src/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/src/domain/forum/application/repositories/students-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from './repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './repositories/prisma-answer-comments-repository'
import { PrismaAnswersRepository } from './repositories/prisma-answers-repository'
import { PrismaQuestionAttachmentsRepository } from './repositories/prisma-question-attachments-repository'
import { PrismaQuestionsCommentsRepository } from './repositories/prisma-questions-comments-repository'
import { PrismaQuestionsRepository } from './repositories/prisma-questions-repository'
import { PrismaStudentsRepository } from './repositories/prisma-students-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionsCommentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },

    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    AnswersRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
    QuestionsRepository,
    QuestionAttachmentsRepository,
    QuestionCommentsRepository,
    StudentsRepository,
  ],
})
export class DatabaseModule {}
