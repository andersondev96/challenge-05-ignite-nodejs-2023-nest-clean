import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'
import { Order } from '../../enterprise/entities/Order'
import { OrdersRepository } from '../repositories/orders-repository'

interface GetOrderUseCaseRequest {
  orderId: string
}

type GetOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class GetOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order,
    })
  }
}
