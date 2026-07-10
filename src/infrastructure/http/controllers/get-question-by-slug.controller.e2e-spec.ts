import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { AppModule } from '@/infra/app.module'
import type { JwtPayload } from '@/infra/auth/jwt.stategy'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from '@/test/factories/make-prisma-question'
import { StudentFactory } from '@/test/factories/make-prisma-student'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication

  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      email: user.email,
    } satisfies JwtPayload)

    await questionFactory.makePrismaQuestion({
      title: 'Question 01',
      content: 'question-01',
      authorId: user.id,
    })

    const response = await request(app.getHttpServer())
      .get('/questions/question-01')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: 'Question 01', slug: 'question-01' }),
    })
  })
})
