import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderWithDeliverymanAndRecipient } from '@/domain/fastfeet/enterprise/entities/value-objects/order-with-deliveryman-and-recipient'
import {
  Order as PrismaOrder,
  Recipient as PrismaRecipient,
  User as PrismaUser,
} from '@prisma/client'

type PrismaOrderWithDeliverymanAndRecipient = PrismaOrder & {
  deliveryman: PrismaUser
  recipient: PrismaRecipient
}

export class PrismaOrderWithDeliverymanAndRecipientMapper {
  static toDomain(
    raw: PrismaOrderWithDeliverymanAndRecipient,
  ): OrderWithDeliverymanAndRecipient {
    return OrderWithDeliverymanAndRecipient.create({
      recipientId: new UniqueEntityId(raw.recipientId),
      recipientName: raw.recipient.name,
      deliverymanId: new UniqueEntityId(raw.deliverymanId),
      deliverymanName: raw.deliveryman.name,
      product: raw.product,
      details: raw.details,
      status: raw.status,
      withdrawnDate: raw.withdrawnDate,
      deliveryDate: raw.deliveryDate,
      image: raw.image,
    })
  }
}
