import { Injectable } from '@nestjs/common'

import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { makeQuestionAttachment } from './make-question-attachments'

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps> = {},
  ): Promise<QuestionAttachment> {
    const questionattachment = makeQuestionAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: questionattachment.attachmentId.toString(),
      },
      data: {
        questionId: questionattachment.questionId.toString(),
      },
    })

    return questionattachment
  }
}
