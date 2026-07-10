import { Attachment as PrismaAttachment } from '@/prisma/generated'
import { UniqueEntityID } from '@/src/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/src/domain/forum/enterprise/entities/answer-attachment'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) throw new Error('Invalid attachment')

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityID(raw.id),
        attachmentId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id),
    )
  }
}
