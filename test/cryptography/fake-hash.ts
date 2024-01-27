import { HashComparer } from '@/domain/fastfeet/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/fastfeet/application/cryptography/hash-generator'

export class FakeHash implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
