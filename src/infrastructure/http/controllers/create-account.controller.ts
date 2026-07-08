import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { StudentAlreadyExistsError } from '@src/domain/forum/application/use-cases/errors/student-already-exists-error'
import { RegisterStudentUseCase } from '@src/domain/forum/application/use-cases/register-student'
import { ZodValidationPipe } from '@src/infrastructure/http/controllers/pipes/zod-validation-pipe'
import { z } from 'zod'

const createAccountSchema = z.object({
  name: z.string().min(1, 'name é obrigatória'),
  email: z.email('email é inválido'),
  password: z.string().min(1, 'password é obrigatória'),
})

type CreateAccountBodySchema = z.infer<typeof createAccountSchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
