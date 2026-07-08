import { Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { AuthenticateStudentUseCase } from '@src/domain/forum/application/use-cases/autenticate-student'
import { ZodValidationPipe } from '@src/infrastructure/http/controllers/pipes/zod-validation-pipe'
import z from 'zod'

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
})

type AutheticateBody = z.infer<typeof authenticateBodySchema>
@Controller('/sessions')
export class AutheticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AutheticateBody) {
    const { email, password } = body
    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      throw new UnauthorizedException('User credentials are invalid')
    }

    const { accessToken } = result.value
    return {
      access_token: accessToken,
    }
  }
}
