import { Injectable } from '@nestjs/common'

import { AttachmentsRepository } from '@/src/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/src/domain/forum/enterprise/entities/attachment'

import { PrismaAttachmentMapper } from '../prisma/mappers/prisma-attachment-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })
  }
}
