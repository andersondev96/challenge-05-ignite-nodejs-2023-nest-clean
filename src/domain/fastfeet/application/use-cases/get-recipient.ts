import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'
import { Recipient } from '../../enterprise/entities/Recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { UsersRepository } from '../repositories/users-repository'

interface GetRecipientUseCaseRequest {
  userId: string
  recipientId: string
}

type CreteUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class GetRecipientUseCase {
  constructor(
    private userRepository: UsersRepository,
    private recipientRepository: RecipientsRepository,
  ) {}

  async execute({
    userId,
    recipientId,
  }: GetRecipientUseCaseRequest): Promise<CreteUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (user.role !== 'ADMIN') {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    return right({
      recipient,
    })
  }
}
