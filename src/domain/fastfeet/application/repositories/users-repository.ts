import { User } from '@/domain/fastfeet/enterprise/entities/User'

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>
  abstract findByCPF(cpf: string): Promise<User | null>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(user: User): Promise<void>
}
