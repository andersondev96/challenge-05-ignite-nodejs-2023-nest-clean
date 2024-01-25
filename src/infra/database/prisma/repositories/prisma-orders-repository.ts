import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrdersRepository } from '@/domain/fastfeet/application/repositories/orders-repository'
import { Order } from '@/domain/fastfeet/enterprise/entities/Order'
import { PrismaService } from '../prisma.service'

export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    throw new Error('Method not implemented.')
  }

  async findManyByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  async create(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
