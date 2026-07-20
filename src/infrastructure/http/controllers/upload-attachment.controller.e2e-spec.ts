import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { beforeAll, describe, expect, test } from 'vitest'

import { StudentFactory } from '@/test/factories/make-prisma-student'

import { AppModule } from '../../app.module'
import { DatabaseModule } from '../../database/database.module'

describe('Upload attachment controller (E2E)', () => {
  let app: INestApplication
  let studdentFactory: StudentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studdentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test('[POST] /attachments - With valid file (.webp)', async () => {
    const user = await studdentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString(), email: user.email })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/sample-files/sample.webp')

    expect(response.status).toBe(201)
  })

  test('[POST] /attachments - Should be not able to upload files larger than 2MB', async () => {
    const user = await studdentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString(), email: user.email })

    const pdfHeader = Buffer.from('%PDF-1.7\n')
    const overSizePdf = Buffer.alloc(1024 * 1024 * 2 + 1)

    pdfHeader.copy(overSizePdf)

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', overSizePdf, { filename: 'file.pdf', contentType: 'application/pdf' })

    expect(response.status).toBe(400)
  })
})
