import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Order, StatusOrder } from '../../enterprise/entities/Order'
import { OrdersRepository } from '../repositories/orders-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { UsersRepository } from '../repositories/users-repository'

interface CreateOrderUseCaseRequest {
  recipientId: string
  deliverymanId: string
  product: string
  details: string
  image?: string
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

export class CreateOrderUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private recipientsRepository: RecipientsRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    recipientId,
    deliverymanId,
    product,
    details,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const deliveryman = await this.usersRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    if (deliveryman.role !== 'ADMIN') {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const order = Order.create({
      recipientId: new UniqueEntityId(recipientId),
      deliverymanId: new UniqueEntityId(deliverymanId),
      product,
      details,
      status: StatusOrder.WAITING,
      createdAt: new Date(),
    })

    await this.ordersRepository.create(order)

    return right({
      order,
    })
  }
}
