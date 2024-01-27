import { Order, OrderProps } from '@/domain/fastfeet/enterprise/entities/Order'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { StatusOrder } from '@prisma/client'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

export async function MakeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) {
  const order = Order.create(
    {
      recipientId: new UniqueEntityId(),
      deliverymanId: new UniqueEntityId(),
      product: faker.commerce.product(),
      details: faker.commerce.productDescription(),
      status: StatusOrder.WAITING,
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return order
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = await MakeOrder(data)

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    })

    return order
  }
}
