import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository'

interface DeleteUserUseCaseRequest {
  userId: string
}

type CreteUserUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<CreteUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    await this.userRepository.delete(user)

    return right(null)
  }
}
