import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

export class FakerHasher implements HashGenerator, HashComparer {
  async hash(value: string): Promise<string> {
    return value.concat('-hashed')
  }
  async compare(plainText: string, hash: string): Promise<boolean> {
    return plainText.concat('-hashed') === hash
  }
}
