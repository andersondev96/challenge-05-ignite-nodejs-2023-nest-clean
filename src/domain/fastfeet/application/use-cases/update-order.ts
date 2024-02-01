import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'
import { StatusOrder } from '@prisma/client'
import { Order } from '../../enterprise/entities/Order'
import { OrdersRepository } from '../repositories/orders-repository'
import { UsersRepository } from '../repositories/users-repository'

interface UpdateOrderUseCaseRequest {
  deliverymanId: string
  orderId: string
  product: string
  details: string
  status?: StatusOrder | undefined
  image?: string | undefined
}

type UpdateOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    private userRepository: UsersRepository,
    private orderRepository: OrdersRepository,
  ) {}

  async execute({
    orderId,
    deliverymanId,
    product,
    details,
    status,
    image,
  }: UpdateOrderUseCaseRequest): Promise<UpdateOrderUseCaseResponse> {
    const deliveryman = await this.userRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    if (deliveryman.role !== 'ADMIN') {
      return left(new NotAllowedError())
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.product = product
    order.details = details

    if (status) {
      order.status = status
    }

    if (image) {
      order.image = image
    }

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
