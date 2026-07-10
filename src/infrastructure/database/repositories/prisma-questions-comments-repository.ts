import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/src/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/src/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/src/domain/forum/enterprise/entities/question-comment'

import { PrismaQuestionCommentMapper } from '../prisma/mappers/prisma-question-comment-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaQuestionsCommentsRepository implements QuestionCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })
    if (!questionComment) return null
    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(
    questionId: string,
    { page = 1, perPage = 20 }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionsComments = await this.prisma.comment.findMany({
      where: { questionId },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return questionsComments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async create(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    })
  }
  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    })
  }
}
