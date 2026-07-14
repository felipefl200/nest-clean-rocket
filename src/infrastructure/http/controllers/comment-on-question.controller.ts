import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import { z } from 'zod'

import { CommentOnQuestionUseCase } from '@/src/domain/forum/application/use-cases/comment-on-question'
import { CurrentUser } from '@/src/infrastructure/auth/current-user.decorator'
import { AuthenticatedUser } from '@/src/infrastructure/auth/jwt.stategy'
import { ZodValidationPipe } from '@/src/infrastructure/http/controllers/pipes/zod-validation-pipe'

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @CurrentUser() user: AuthenticatedUser,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body

    const result = await this.commentOnQuestion.execute({
      content,
      questionId,
      authorId: user.userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
