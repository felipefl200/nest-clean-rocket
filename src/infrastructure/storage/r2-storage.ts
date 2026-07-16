import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import {
  UploadParams,
  UploadResult,
  Uploader,
} from '@/src/domain/forum/application/storage/uploader'
import { Env } from '@/src/infrastructure/env/env-schema'

@Injectable()
export class R2Storage implements Uploader {
  private readonly client: S3Client
  private readonly bucketName: string

  constructor(config: ConfigService<Env, true>) {
    const accountId = config.get('CLOUDFLARE_ACCOUNT_ID', { infer: true })

    this.bucketName = config.get('AWS_BUCKET_NAME', { infer: true })
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.get('AWS_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY', { infer: true }),
      },
    })
  }

  async upload({ fileName, fileType, body }: UploadParams): Promise<UploadResult> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return { url: fileName }
  }
}
