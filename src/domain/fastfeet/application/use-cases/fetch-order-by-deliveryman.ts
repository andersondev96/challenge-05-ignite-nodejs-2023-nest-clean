import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OrderWithDeliverymanAndRecipient } from '../../enterprise/entities/value-objects/order-with-deliveryman-and-recipient'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchOrderByDeliverymanUseCaseRequest {
  userId: string
  page: number
}

type FetchOrderByDeliverymanUseCaseResponse = Either<
  null,
  {
    orders: OrderWithDeliverymanAndRecipient[]
  }
>

@Injectable()
export class FetchOrderByDeliverymanUseCase {
  constructor(private orderRepository: OrdersRepository) {}

  async execute({
    userId,
    page,
  }: FetchOrderByDeliverymanUseCaseRequest): Promise<FetchOrderByDeliverymanUseCaseResponse> {
    const orders = await this.orderRepository.findManyByUserId(userId, {
      page,
    })

    return right({
      orders,
    })
  }
}
