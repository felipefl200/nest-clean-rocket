import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'

import { FetchQuestionAnswersUseCase } from '@/src/domain/forum/application/use-cases/fetch-question-answers'
import { ZodValidationPipe } from '@/src/infrastructure/http/controllers/pipes/zod-validation-pipe'
import { AnswerPresenter } from '@/src/infrastructure/http/presenters/answer-presenter'

import { PageQueryParamSchema, pageQueryParamSchema } from './fetch-recent-questions.controller'

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answers } = result.value

    return { answers: answers.map(AnswerPresenter.toHttp) }
  }
}
