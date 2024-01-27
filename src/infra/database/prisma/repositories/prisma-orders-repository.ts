import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrdersRepository } from '@/domain/fastfeet/application/repositories/orders-repository'
import { Order } from '@/domain/fastfeet/enterprise/entities/Order'
import { Injectable } from '@nestjs/common'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async findManyByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliverymanId: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.delete({
      where: {
        id: data.id,
      },
    })
  }
}
