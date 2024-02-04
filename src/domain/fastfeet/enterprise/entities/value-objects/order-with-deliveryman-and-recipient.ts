import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { StatusOrder } from '@prisma/client'

export interface OrderWithDeliverymanAndRecipientProps {
  recipientId: UniqueEntityId
  recipientName: string
  deliverymanId: UniqueEntityId
  deliverymanName: string
  product: string
  details: string
  status?: StatusOrder | null
  withdrawnDate?: Date | null
  deliveryDate?: Date | null
  image?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class OrderWithDeliverymanAndRecipient extends ValueObject<OrderWithDeliverymanAndRecipientProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get recipientName() {
    return this.props.recipientName
  }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  get deliverymanName() {
    return this.props.deliverymanName
  }

  get product() {
    return this.props.product
  }

  get details() {
    return this.props.details
  }

  get status() {
    return this.props.status
  }

  get withdrawnDate() {
    return this.props.withdrawnDate
  }

  get deliveryDate() {
    return this.props.deliveryDate
  }

  get image() {
    return this.props.image
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: OrderWithDeliverymanAndRecipientProps) {
    return new OrderWithDeliverymanAndRecipient(props)
  }
}
