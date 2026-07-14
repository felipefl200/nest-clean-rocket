import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { DeleteAnswerCommentUseCase } from '@/src/domain/forum/application/use-cases/delete-answer-comment'
import { CurrentUser } from '@/src/infrastructure/auth/current-user.decorator'
import { AuthenticatedUser } from '@/src/infrastructure/auth/jwt.stategy'

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private readonly deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: AuthenticatedUser, @Param('id') answerCommentId: string) {
    const result = await this.deleteAnswerComment.execute({
      authorId: user.userId,
      answerCommentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
