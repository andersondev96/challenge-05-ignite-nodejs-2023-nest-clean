import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'
import { StatusOrder } from '@prisma/client'
import { Order } from '../../enterprise/entities/Order'
import { OrdersRepository } from '../repositories/orders-repository'
import { UsersRepository } from '../repositories/users-repository'

interface PlaceOrderUseCaseRequest {
  userId: string
  orderId: string
  status: StatusOrder
  image?: string
}

type PlaceOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class PlaceOrderUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    userId,
    orderId,
    status,
    image,
  }: PlaceOrderUseCaseRequest): Promise<PlaceOrderUseCaseResponse> {
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

    if (
      (status === StatusOrder.DELIVERED &&
        user.id.toString() !== order.deliverymanId.toString()) ||
      (status === StatusOrder.DELIVERED && !image)
    ) {
      return left(new NotAllowedError())
    }

    order.status = status

    if (image) {
      order.image = image
    }

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
