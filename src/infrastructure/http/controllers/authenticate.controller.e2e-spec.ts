import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { HashGenerator } from '@/src/domain/forum/application/cryptography/hash-generator'

import { AppModule } from '../../app.module'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let hashGenerator: HashGenerator

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    hashGenerator = moduleRef.get(HashGenerator)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /sessions', async () => {
    const passwordHashed = await hashGenerator.hash('123456')
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: passwordHashed,
      },
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
