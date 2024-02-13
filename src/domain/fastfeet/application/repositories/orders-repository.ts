import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/Order'
import { OrderWithDeliverymanAndRecipient } from '../../enterprise/entities/value-objects/order-with-deliveryman-and-recipient'

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>

  abstract findManyByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<OrderWithDeliverymanAndRecipient[]>

  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
