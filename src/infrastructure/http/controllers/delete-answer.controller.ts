import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { DeleteAnswerUseCase } from '@/src/domain/forum/application/use-cases/delete-answer'
import { CurrentUser } from '@/src/infrastructure/auth/current-user.decorator'
import { AuthenticatedUser } from '@/src/infrastructure/auth/jwt.stategy'

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: AuthenticatedUser, @Param('id') answerId: string) {
    const result = await this.deleteAnswer.execute({
      authorId: user.userId,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
