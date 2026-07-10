import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { AuthenticateStudentUseCase } from '@/src/domain/forum/application/use-cases/autenticate-student'
import { WrongCredentialsError } from '@/src/domain/forum/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/src/infrastructure/auth/public'
import { ZodValidationPipe } from '@/src/infrastructure/http/controllers/pipes/zod-validation-pipe'
import z from 'zod'

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
})

type AutheticateBody = z.infer<typeof authenticateBodySchema>
@Controller('/sessions')
@Public()
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
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value
    return {
      access_token: accessToken,
    }
  }
}
