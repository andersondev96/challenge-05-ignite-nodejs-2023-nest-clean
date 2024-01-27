import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/fastfeet/enterprise/entities/Order'
import { Prisma, Order as PrismaOrder } from '@prisma/client'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        recipientId: new UniqueEntityId(raw.recipientId),
        deliverymanId: new UniqueEntityId(raw.deliverymanId),
        product: raw.product,
        details: raw.details,
        status: raw.status,
        withdrawnDate: raw.withdrawnDate,
        deliveryDate: raw.deliveryDate,
        image: raw.image,
        updatedAt: raw.updatedAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId.toString(),
      product: order.product,
      details: order.details,
      status: order.status,
      withdrawnDate: order.withdrawDate,
      deliveryDate: order.deliveryDate,
      image: order.image,
      updatedAt: order.updatedAt,
    }
  }
}
