import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { Uploader } from '@/domain/forum/application/storage/uploader'
import { AppModule } from '@/infra/app.module'
import type { JwtPayload } from '@/infra/auth/jwt.stategy'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from '@/test/factories/make-prisma-student'
import { FakeUploader } from '@/test/storage/fake-uploader'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

describe('Upload attachment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let uploader: FakeUploader

  beforeAll(async () => {
    uploader = new FakeUploader()

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    })
      .overrideProvider(Uploader)
      .useValue(uploader)
      .compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /attachments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      email: user.email,
    } satisfies JwtPayload)

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', onePixelPng, {
        filename: 'avatar.png',
        contentType: 'image/png',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    })
    expect(uploader.uploads).toHaveLength(1)

    const attachmentOnDatabase = await prisma.attachment.findUnique({
      where: { id: response.body.attachmentId },
    })

    expect(attachmentOnDatabase).toEqual(
      expect.objectContaining({
        title: 'avatar.png',
        url: expect.stringMatching(/^fake-upload\/[\da-f-]+\.png$/),
      }),
    )
  })
})
