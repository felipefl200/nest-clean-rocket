import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { DeleteQuestionCommentUseCase } from '@/src/domain/forum/application/use-cases/delete-question-comment'
import { CurrentUser } from '@/src/infrastructure/auth/current-user.decorator'
import { AuthenticatedUser } from '@/src/infrastructure/auth/jwt.stategy'

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(private readonly deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: AuthenticatedUser, @Param('id') questionCommentId: string) {
    const result = await this.deleteQuestionComment.execute({
      authorId: user.userId,
      questionCommentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
