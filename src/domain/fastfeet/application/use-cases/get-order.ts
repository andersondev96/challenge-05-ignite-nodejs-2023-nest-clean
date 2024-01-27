import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Order } from '../../enterprise/entities/Order'
import { OrdersRepository } from '../repositories/orders-repository'
import { UsersRepository } from '../repositories/users-repository'

interface GetOrderUseCaseRequest {
  userId: string
  orderId: string
}

type GetOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

export class GetOrderUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    userId,
    orderId,
  }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (user.role !== 'ADMIN') {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order,
    })
  }
}
