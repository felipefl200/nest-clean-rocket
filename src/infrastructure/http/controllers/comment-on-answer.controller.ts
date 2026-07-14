import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import { z } from 'zod'

import { CommentOnAnswerUseCase } from '@/src/domain/forum/application/use-cases/comment-on-answer'
import { CurrentUser } from '@/src/infrastructure/auth/current-user.decorator'
import { AuthenticatedUser } from '@/src/infrastructure/auth/jwt.stategy'
import { ZodValidationPipe } from '@/src/infrastructure/http/controllers/pipes/zod-validation-pipe'

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private readonly commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @CurrentUser() user: AuthenticatedUser,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
      authorId: user.userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
