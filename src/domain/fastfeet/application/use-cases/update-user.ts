import { Either, left, right } from '@/core/either'
import { User } from '../../enterprise/entities/User'
import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from './errors/UserNotFoundError'

interface UpdateUserUseCaseRequest {
  userId: string
  name: string
  cpf: string
  password: string
}

type UpdateUserUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User
  }
>

export class UpdateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    name,
    cpf,
    password,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotFoundError())
    }

    const hashPassword = await this.hashGenerator.hash(password)

    user.name = name
    user.cpf = cpf
    user.password = hashPassword

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
