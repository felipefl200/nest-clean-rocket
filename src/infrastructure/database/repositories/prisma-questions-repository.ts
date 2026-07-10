import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@src/core/repositories/pagination-params'
import { QuestionsRepository } from '@src/domain/forum/application/repositories/questions-repository'
import { Question } from '@src/domain/forum/enterprise/entities/question'

import { PrismaQuestionMapper } from '../prisma/mappers/prisma-question-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })
    if (!question) return null
    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })
    if (!question) return null
    return PrismaQuestionMapper.toDomain(question)
  }
  async findManyRecent({ page = 1 }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async create(question: Question): Promise<void> {
    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })
  }

  async save(question: Question): Promise<void> {
    await this.prisma.question.update({
      where: { id: question.id.toString() },
      data: PrismaQuestionMapper.toPrisma(question),
    })
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.prisma.question.delete({
      where: { id: data.id },
    })
  }
}
