import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryAttachmentsRepository } from '@/test/repositories/in-memory-attachments-repository'
import { FakeUploader } from '@/test/storage/fake-uploader'

import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let attachmentsRepository: InMemoryAttachmentsRepository
let uploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    uploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(attachmentsRepository, uploader)
  })

  it('should upload and persist an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: new Uint8Array([137, 80, 78, 71]),
    })

    expect(result.isRight()).toBe(true)
    if (!result.isRight()) throw new Error('Expected a successful attachment upload')

    expect(uploader.uploads).toHaveLength(1)
    expect(uploader.uploads[0].fileName).toMatch(/^[\da-f-]+\.png$/)
    expect(attachmentsRepository.items).toHaveLength(1)
    expect(attachmentsRepository.items[0]).toEqual(result.value.attachment)
  })

  it('should reject unsupported attachment types', async () => {
    const result = await sut.execute({
      fileName: 'document.pdf',
      fileType: 'application/pdf',
      body: new Uint8Array(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
    expect(uploader.uploads).toHaveLength(0)
    expect(attachmentsRepository.items).toHaveLength(0)
  })
})
