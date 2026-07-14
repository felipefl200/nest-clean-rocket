import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import z from 'zod'

import { EditQuestionUseCase } from '@/src/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/src/infrastructure/auth/current-user.decorator'
import { AuthenticatedUser } from '@/src/infrastructure/auth/jwt.stategy'
import { ZodValidationPipe } from '@/src/infrastructure/http/controllers/pipes/zod-validation-pipe'

const editQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionSchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editQuestionSchema)) body: EditQuestionBodySchema,
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') questionId: string,
  ) {
    const { title, content } = body

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: user.userId,
      attachmentsIds: [],
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
