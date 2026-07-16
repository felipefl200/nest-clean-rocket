export interface UploadParams {
  fileName: string
  fileType: string
  body: Uint8Array
}

export interface UploadResult {
  url: string
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<UploadResult>
}
