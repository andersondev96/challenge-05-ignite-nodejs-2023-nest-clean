import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrdersRepository } from '@/domain/fastfeet/application/repositories/orders-repository'
import { Order } from '@/domain/fastfeet/enterprise/entities/Order'
import { OrderWithDeliverymanAndRecipient } from '@/domain/fastfeet/enterprise/entities/value-objects/order-with-deliveryman-and-recipient'
import { InMemoryRecipientRepository } from './in-memory-recipient-repository'
import { InMemoryUsersRepository } from './in-memory-users-repository'

export class InMemoryOrderRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(
    private usersRepository: InMemoryUsersRepository,
    private recipientsRepository: InMemoryRecipientRepository,
  ) {}

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyByUserId(userId: string, { page }: PaginationParams) {
    const ordersWithDeliverymanAndRecipient = this.items
      .filter((item) => item.deliverymanId.toString() === userId)
      .slice((page - 1) * 20, page * 20)
      .map((order) => {
        const recipient = this.recipientsRepository.items.find((recipient) => {
          return recipient.id.equals(order.recipientId)
        })

        const deliveryman = this.usersRepository.items.find((deliveryman) => {
          return deliveryman.id.equals(order.deliverymanId)
        })

        if (!deliveryman) {
          throw new Error(`
          Deliveryman with ID "${order.deliverymanId.toString()}" does not exist`)
        }

        if (!recipient) {
          throw new Error(`
          Recipient with ID "${order.recipientId.toString()}" does not exist`)
        }

        return OrderWithDeliverymanAndRecipient.create({
          recipientId: order.recipientId,
          recipientName: recipient.name,
          deliverymanId: deliveryman.id,
          deliverymanName: deliveryman.name,
          product: order.product,
          details: order.details,
          status: order.status,
          withdrawnDate: order.withdrawDate,
          deliveryDate: order.deliveryDate,
          image: order.image,
        })
      })

    return ordersWithDeliverymanAndRecipient
  }

  async create(order: Order) {
    this.items.push(order)
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }
}
