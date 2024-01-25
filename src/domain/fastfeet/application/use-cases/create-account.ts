import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'
import { User } from '../../enterprise/entities/User'
import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError'

interface CreateAccountUseCaseRequest {
  name: string
  cpf: string
  password: string
  role: 'ADMIN' | 'DELIVERYMAN'
}

type CreteUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private userRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
    role,
  }: CreateAccountUseCaseRequest): Promise<CreteUserUseCaseResponse> {
    const userAlreadyExists = await this.userRepository.findByCPF(cpf)

    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError(cpf))
    }

    const passwordHashed = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      cpf,
      password: passwordHashed,
      role,
    })

    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
