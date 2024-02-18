import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { StatusOrder } from '@prisma/client'
import { Order } from '../entities/Order'

export class ChangeStatusEvent implements DomainEvent {
  public ocurredAt: Date
  public status: StatusOrder | undefined
  public order: Order

  constructor(order: Order) {
    this.ocurredAt = new Date()
    this.status = order.status
    this.order = order
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id
  }
}
