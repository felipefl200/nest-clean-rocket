import { Prisma, type Attachment as PrismaAttachment } from '@/prisma/generated'
import { UniqueEntityID } from '@/src/core/entities/unique-entity-id'
import { Attachment } from '@/src/domain/forum/enterprise/entities/attachment'

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        link: raw.url,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(attachment: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.link,
    }
  }
}
