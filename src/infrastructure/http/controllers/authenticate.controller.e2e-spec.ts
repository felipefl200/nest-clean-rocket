import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StudentFactory } from '@/test/factories/make-prisma-student'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let hashGenerator: HashGenerator

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    hashGenerator = moduleRef.get(HashGenerator)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /sessions', async () => {
    const passwordHashed = await hashGenerator.hash('123456')
    await studentFactory.makePrismaStudent({
      email: 'johndoe@example.com',
      password: passwordHashed,
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
