import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { StatusOrder } from '@prisma/client'
import { ChangeStatusEvent } from '../events/change-status-event'

export interface OrderProps {
  recipientId: UniqueEntityId
  deliverymanId: UniqueEntityId
  product: string
  details: string
  status: StatusOrder
  withdrawnDate?: Date | null
  deliveryDate?: Date | null
  image?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  get product() {
    return this.props.product
  }

  set product(product: string) {
    this.props.product = product
    this.touch()
  }

  get details() {
    return this.props.details
  }

  set details(details: string) {
    this.props.details = details
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: StatusOrder) {
    this.props.status = status
    this.touch()
    this.addDomainEvent(new ChangeStatusEvent(this))
  }

  get withdrawDate() {
    return this.props.withdrawnDate
  }

  set withdrawDate(date: Date | null | undefined) {
    this.props.withdrawnDate = date
    this.touch()
  }

  get deliveryDate() {
    return this.props.deliveryDate
  }

  set deliveryDate(date: Date | null | undefined) {
    this.props.deliveryDate = date
    this.touch()
  }

  get image() {
    return this.props.image
  }

  set image(image: string | null | undefined) {
    this.props.image ? (this.props.image = image) : (this.props.image = null)
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'status'>,
    id?: UniqueEntityId,
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? StatusOrder.WAITING,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return order
  }
}
