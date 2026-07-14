import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import z from 'zod'

import { EditAnswerUseCase } from '@/src/domain/forum/application/use-cases/edit-answer'
import { CurrentUser } from '@/src/infrastructure/auth/current-user.decorator'
import { AuthenticatedUser } from '@/src/infrastructure/auth/jwt.stategy'
import { ZodValidationPipe } from '@/src/infrastructure/http/controllers/pipes/zod-validation-pipe'

const editAnswerSchema = z.object({
  content: z.string(),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerSchema>

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private readonly editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editAnswerSchema)) body: EditAnswerBodySchema,
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') answerId: string,
  ) {
    const { content } = body

    const result = await this.editAnswer.execute({
      content,
      answerId,
      authorId: user.userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
