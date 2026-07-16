import {
  UploadParams,
  UploadResult,
  Uploader,
} from '@/src/domain/forum/application/storage/uploader'

export class FakeUploader implements Uploader {
  public uploads: UploadParams[] = []

  async upload(params: UploadParams): Promise<UploadResult> {
    this.uploads.push(params)

    return {
      url: `fake-upload/${params.fileName}`,
    }
  }
}
