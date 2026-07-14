import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'

import { FetchQuestionCommentsUseCase } from '@/src/domain/forum/application/use-cases/fetch-question-comments'
import { ZodValidationPipe } from '@/src/infrastructure/http/controllers/pipes/zod-validation-pipe'
import { CommentPresenter } from '@/src/infrastructure/http/presenters/comment-presenter'
import { PageQueryParamSchema, pageQueryParamSchema } from './fetch-recent-questions.controller'

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { questionComments } = result.value

    return { comments: questionComments.map(CommentPresenter.toHttp) }
  }
}
