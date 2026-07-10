import { Injectable } from '@nestjs/common'
import { AnswerAttachmentsRepository } from '@src/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@src/domain/forum/enterprise/entities/answer-attachment'

import { PrismaAnswerAttachmentMapper } from '../prisma/mappers/prisma-answer-attachment-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    })
    return attachments.map(PrismaAnswerAttachmentMapper.toDomain)
  }
  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }
}
