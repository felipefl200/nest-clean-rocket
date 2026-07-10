import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Encrypter } from '@/src/domain/forum/application/cryptography/encrypter'
import { HashComparer } from '@/src/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/src/domain/forum/application/cryptography/hash-generator'

import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
