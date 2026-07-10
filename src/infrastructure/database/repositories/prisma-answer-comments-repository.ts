import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@src/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@src/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@src/domain/forum/enterprise/entities/answer-comment'

import { PrismaAnswerCommentMapper } from '../prisma/mappers/prisma-answer-comment-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })
    if (!answerComment) return null
    return PrismaAnswerCommentMapper.toDomain(answerComment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page = 1, perPage = 20 }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const questionsComments = await this.prisma.comment.findMany({
      where: { answerId },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return questionsComments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async create(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    })
  }
  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    })
  }
}
