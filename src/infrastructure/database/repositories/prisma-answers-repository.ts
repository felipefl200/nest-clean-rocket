import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@src/core/repositories/pagination-params'
import { AnswersRepository } from '@src/domain/forum/application/repositories/answers-repository'
import { Answer } from '@src/domain/forum/enterprise/entities/answer'

import { PrismaAnswerMapper } from '../prisma/mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })
    if (!answer) return null
    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    { page = 1, perPage = 20 }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async create(answer: Answer): Promise<void> {
    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    })
  }

  async save(answer: Answer): Promise<void> {
    await this.prisma.answer.update({
      where: {
        id: answer.id.toString(),
      },
      data: PrismaAnswerMapper.toPrisma(answer),
    })
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    })
  }
}
