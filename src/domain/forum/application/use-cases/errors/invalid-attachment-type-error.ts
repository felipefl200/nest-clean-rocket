import { UseCaseError } from '@/src/core/errors/use-case-error'

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(type: string) {
    super(`Attachment type "${type}" is not allowed`)
  }
}
