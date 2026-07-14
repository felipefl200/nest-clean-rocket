import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'

import { FetchAnswerCommentsUseCase } from '@/src/domain/forum/application/use-cases/fetch-answer-comments'
import { ZodValidationPipe } from '@/src/infrastructure/http/controllers/pipes/zod-validation-pipe'
import { CommentPresenter } from '@/src/infrastructure/http/presenters/comment-presenter'
import { PageQueryParamSchema, pageQueryParamSchema } from './fetch-recent-questions.controller'

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answerComments } = result.value

    return { comments: answerComments.map(CommentPresenter.toHttp) }
  }
}
