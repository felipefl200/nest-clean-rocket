import { FakerHasher } from '@test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from '@test/repositories/in-memory-students-repisotory'
import { beforeEach, describe, expect, it } from 'vitest'

import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: RegisterStudentUseCase
let fakerHasher: FakerHasher

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakerHasher = new FakerHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakerHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'Felipe',
      email: 'johndoe@test.net',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
    const hashedPassword = await fakerHasher.hash('123456')
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
