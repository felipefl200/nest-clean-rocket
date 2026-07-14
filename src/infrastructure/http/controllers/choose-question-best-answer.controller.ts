import { BadRequestException, Controller, HttpCode, Param, Patch } from '@nestjs/common'

import { ChooseQuestionBestAnswerUseCase } from '@/src/domain/forum/application/use-cases/choose-question-best-answer'
import { CurrentUser } from '@/src/infrastructure/auth/current-user.decorator'
import { AuthenticatedUser } from '@/src/infrastructure/auth/jwt.stategy'

@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(private readonly chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: AuthenticatedUser,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.chooseQuestionBestAnswer.execute({
      authorId: user.userId,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
