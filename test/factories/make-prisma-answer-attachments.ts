import { Injectable } from '@nestjs/common'

import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { makeAnswerAttachment } from './make-answer-attachments'

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    data: Partial<AnswerAttachmentProps> = {},
  ): Promise<AnswerAttachment> {
    const answerattachment = makeAnswerAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: answerattachment.attachmentId.toString(),
      },
      data: {
        answerId: answerattachment.answerId.toString(),
      },
    })

    return answerattachment
  }
}
