import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/Order'

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findManyByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<Order[]>

  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
