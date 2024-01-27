import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { UsersRepository } from '../repositories/users-repository'

interface DeleteRecipientUseCaseRequest {
  userId: string
  recipientId: string
}

type CreteUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteRecipientUseCase {
  constructor(
    private userRepository: UsersRepository,
    private recipientRepository: RecipientsRepository,
  ) {}

  async execute({
    userId,
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<CreteUserUseCaseResponse> {
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

    await this.recipientRepository.delete(recipient)

    return right(null)
  }
}
