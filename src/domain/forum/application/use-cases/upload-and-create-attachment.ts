import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/src/core/either'
import { Attachment } from '@/src/domain/forum/enterprise/entities/attachment'

import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'

const extensionByMimeType = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
} as const

type AllowedMimeType = keyof typeof extensionByMimeType

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Uint8Array
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private readonly attachmentsRepository: AttachmentsRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!(fileType in extensionByMimeType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const extension = extensionByMimeType[fileType as AllowedMimeType]
    const remoteFileName = `${randomUUID()}${extension}`
    const { url } = await this.uploader.upload({
      fileName: remoteFileName,
      fileType,
      body,
    })

    const attachment = Attachment.create({
      title: fileName,
      link: url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}
