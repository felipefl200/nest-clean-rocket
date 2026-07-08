import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { envApi } from '@src/env/env'
import { PrismaService } from '@src/infrastructure/database/prisma/prisma.service'
import { ZodValidationPipe } from '@src/infrastructure/http/controllers/pipes/zod-validation-pipe'
import { hash } from 'bcrypt'
import { z } from 'zod'

const createAccountSchema = z.object({
  name: z.string().min(1, 'name é obrigatória'),
  email: z.email('email é inválido'),
  password: z.string().min(1, 'password é obrigatória'),
})

type CreateAccountBodySchema = z.infer<typeof createAccountSchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists')
    }

    const hashedPassword = await hash(
      password,
      envApi.NODE_ENV === 'development' ? 4 : envApi.BCRYPT_COST,
    )

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
