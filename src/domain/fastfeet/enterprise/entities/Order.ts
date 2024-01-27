import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { StatusOrder } from '@prisma/client'

export interface OrderProps {
  recipientId: UniqueEntityId
  deliverymanId: UniqueEntityId
  product: string
  details: string
  status?: StatusOrder | null
  withdrawnDate?: Date | null
  deliveryDate?: Date | null
  image?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends Entity<OrderProps> {
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
  }

  get details() {
    return this.props.details
  }

  set details(details: string) {
    this.props.details = details
  }

  get status() {
    return this.props.status
  }

  set status(status: StatusOrder | null | undefined) {
    this.props.status
      ? (this.props.status = status)
      : (this.props.status = null)
  }

  get withdrawDate() {
    return this.props.withdrawnDate
  }

  set withdrawDate(withdrawnDate: Date | null | undefined) {
    this.props.withdrawnDate
      ? (this.props.withdrawnDate = withdrawnDate)
      : (this.props.withdrawnDate = null)
  }

  get deliveryDate() {
    return this.props.deliveryDate
  }

  set deliveryDate(deliveryDate: Date | null | undefined) {
    this.props.deliveryDate
      ? (this.props.withdrawnDate = deliveryDate)
      : (this.props.withdrawnDate = null)
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

  static create(props: OrderProps, id?: UniqueEntityId) {
    const order = new Order(props, id)

    return order
  }
}
