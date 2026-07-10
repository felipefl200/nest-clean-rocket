import { Injectable } from '@nestjs/common'
import { QuestionAttachmentsRepository } from '@src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@src/domain/forum/enterprise/entities/question-attachment'

import { PrismaQuestionAttachmentMapper } from '../prisma/mappers/prisma-question-attachment-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })
    return attachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }
  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }
}
