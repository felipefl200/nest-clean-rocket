import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CreateQuestionUseCase } from '@src/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@src/infrastructure/auth/current-user.decorator'
import { AuthenticatedUser } from '@src/infrastructure/auth/jwt.stategy'
import { ZodValidationPipe } from '@src/infrastructure/http/controllers/pipes/zod-validation-pipe'
import z from 'zod'

const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionSchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionSchema)) body: CreateQuestionBodySchema,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const { title, content } = body

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: user.userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
