import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { FetchRecentQuestionsUseCase } from '@src/domain/forum/application/use-cases/fetch-recent-questions'
import { JwtAuthGuard } from '@src/infrastructure/auth/jwt-auth.guard'
import z from 'zod'

import { QuestionPresenter } from '../presenters/question-presenter'
import { ZodValidationPipe } from './pipes/zod-validation-pipe'

export const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

export type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentQuestions.execute({
      page,
    })

    if (result.isLeft()) {
      throw new Error('Não foi possível listar as perguntas')
    }

    const { questions } = result.value

    return { questions: questions.map(QuestionPresenter.toHttp) }
  }
}
