import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'
import { Recipient } from '../../enterprise/entities/Recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { UsersRepository } from '../repositories/users-repository'

interface CreateRecipientUseCaseRequest {
  userId: string
  name: string
  address: string
}

type CreateRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    userId,
    name,
    address,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (user.role !== 'ADMIN') {
      return left(new NotAllowedError())
    }

    const recipient = Recipient.create({
      name,
      address,
      userId: new UniqueEntityId(userId),
    })

    await this.recipientsRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
