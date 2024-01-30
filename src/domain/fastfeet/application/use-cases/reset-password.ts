import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'
import { User } from '../../enterprise/entities/User'
import { HashComparer } from '../cryptography/hash-comparer'
import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users-repository'

interface ResetPasswordUseCaseRequest {
  userId: string
  cpf: string
  oldPassword: string
  newPassword: string
}

type ResetPasswordUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User
  }
>

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private userRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    userId,
    cpf,
    oldPassword,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (user.role !== 'ADMIN') {
      return left(new NotAllowedError())
    }

    const findUser = await this.userRepository.findByCPF(cpf)

    if (!findUser) {
      return left(new ResourceNotFoundError())
    }

    const verifyPassword = await this.hashComparer.compare(
      oldPassword,
      user.password,
    )

    if (!verifyPassword) {
      return left(new NotAllowedError())
    }

    const hashPassword = await this.hashGenerator.hash(newPassword)

    findUser.password = hashPassword

    await this.userRepository.save(findUser)

    return right({
      user,
    })
  }
}
