import { FakeEncrypter } from '@test/cryptography/fake-encrypter'
import { FakerHasher } from '@test/cryptography/fake-hasher'
import { makeStudent } from '@test/factories/make-student'
import { InMemoryStudentsRepository } from '@test/repositories/in-memory-students-repisotory'
import { beforeEach, describe, expect, it } from 'vitest'

import { AuthenticateStudentUseCase } from './autenticate-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakerHasher: FakerHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakerHasher = new FakerHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakerHasher, fakeEncrypter)
  })

  it('should be able to authenticate a student', async () => {
    const password = await fakerHasher.hash('123456')

    const newStudent = makeStudent({
      email: 'johndoe@test.net',
      password,
    })

    inMemoryStudentsRepository.items.push(newStudent)

    const result = await sut.execute({
      email: 'johndoe@test.net',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveProperty('accessToken')
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
