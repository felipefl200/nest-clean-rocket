import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { compare, hash } from 'bcrypt'

import { HashComparer } from '@/src/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/src/domain/forum/application/cryptography/hash-generator'
import { Env } from '@/src/infrastructure/env/env-schema'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private static readonly BCRYPT_MAX_INPUT_BYTES = 72

  constructor(private readonly configService: ConfigService<Env, true>) {}

  hash(value: string): Promise<string> {
    this.ensureValidPasswordLength(value)
    const cost = this.configService.get('BCRYPT_COST', { infer: true })
    return hash(value, cost)
  }

  compare(plainText: string, hash: string): Promise<boolean> {
    this.ensureValidPasswordLength(plainText)
    return compare(plainText, hash)
  }

  private ensureValidPasswordLength(value: string) {
    if (Buffer.byteLength(value, 'utf-8') > BcryptHasher.BCRYPT_MAX_INPUT_BYTES) {
      throw new Error('Password exceeds bcrypt maximum input length of 72 bytes')
    }
  }
}
