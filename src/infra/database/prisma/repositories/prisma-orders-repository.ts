import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrdersRepository } from '@/domain/fastfeet/application/repositories/orders-repository'
import { Order } from '@/domain/fastfeet/enterprise/entities/Order'
import { OrderWithDeliverymanAndRecipient } from '@/domain/fastfeet/enterprise/entities/value-objects/order-with-deliveryman-and-recipient'
import { Injectable } from '@nestjs/common'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaOrderWithDeliverymanAndRecipientMapper } from '../mappers/prisma-order-with-deliveryman-and-recipient-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<OrderWithDeliverymanAndRecipient | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        deliveryman: true,
        recipient: true,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderWithDeliverymanAndRecipientMapper.toDomain(order)
  }

  async findManyByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<OrderWithDeliverymanAndRecipient[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliverymanId: userId,
      },
      include: {
        deliveryman: true,
        recipient: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return orders.map(PrismaOrderWithDeliverymanAndRecipientMapper.toDomain)
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
