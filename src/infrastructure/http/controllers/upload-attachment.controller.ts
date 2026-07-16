import type { Express } from 'express'

import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { UploadAndCreateAttachmentUseCase } from '@/src/domain/forum/application/use-cases/upload-and-create-attachment'

const MAX_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(private readonly uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE_IN_BYTES },
    }),
  )
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_IN_BYTES }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      throw new UnsupportedMediaTypeException(result.value.message)
    }

    return {
      attachmentId: result.value.attachment.id.toString(),
    }
  }
}
