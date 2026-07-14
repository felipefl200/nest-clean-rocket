import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { DeleteQuestionUseCase } from '@/src/domain/forum/application/use-cases/delete-question'
import { CurrentUser } from '@/src/infrastructure/auth/current-user.decorator'
import { AuthenticatedUser } from '@/src/infrastructure/auth/jwt.stategy'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private readonly deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: AuthenticatedUser, @Param('id') questionId: string) {
    const result = await this.deleteQuestion.execute({
      authorId: user.userId,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
