import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import z from 'zod'

import { AnswerQuestionUseCase } from '@/src/domain/forum/application/use-cases/answer-question'
import { CurrentUser } from '@/src/infrastructure/auth/current-user.decorator'
import { AuthenticatedUser } from '@/src/infrastructure/auth/jwt.stategy'
import { ZodValidationPipe } from '@/src/infrastructure/http/controllers/pipes/zod-validation-pipe'

const answerQuestionSchema = z.object({
  content: z.string(),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionSchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private readonly answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(answerQuestionSchema)) body: AnswerQuestionBodySchema,
    @CurrentUser() user: AuthenticatedUser,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body

    const result = await this.answerQuestion.execute({
      content,
      questionId,
      authorId: user.userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
