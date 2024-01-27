import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrdersRepository } from '@/domain/fastfeet/application/repositories/orders-repository'
import { StatusOrderUpdatedEvent } from '@/domain/fastfeet/enterprise/events/status-order-updated-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnStatusOrderUpdated implements EventHandler {
  constructor(
    private orderRepository: OrdersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendStatusOrderUpdated.bind(this),
      StatusOrderUpdatedEvent.name,
    )
  }

  private async sendStatusOrderUpdated({ order }: StatusOrderUpdatedEvent) {
    const findOrder = await this.orderRepository.findById(order.id.toString())

    if (findOrder) {
      await this.sendNotification.execute({
        recipientId: order.recipientId.toString(),
        title: `Atualização do status de sua encomenda para ${order.status}`,
        content: order.product,
      })
    }
  }
}
