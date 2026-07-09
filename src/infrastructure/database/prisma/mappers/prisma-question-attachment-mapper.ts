import { Attachment as PrismaAttachment } from '@prisma/generated'
import { UniqueEntityID } from '@src/core/entities/unique-entity-id'
import { QuestionAttachment } from '@src/domain/forum/enterprise/entities/question-attachment'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) throw new Error('Invalid attachment')

    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityID(raw.id),
        attachmentId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    )
  }
}
