import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { RecipientsRepository } from '@/domain/fastfeet/application/repositories/recipients-repository'
import { ChangeStatusEvent } from '@/domain/fastfeet/enterprise/events/change-status-event'
import { Injectable } from '@nestjs/common'
import { SendNotificationUseCase } from '../use-cases/send-notification'

@Injectable()
export class OnChangeStatus implements EventHandler {
  constructor(
    private recipientRepository: RecipientsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendStatusOrderUpdated.bind(this),
      ChangeStatusEvent.name,
    )
  }

  private async sendStatusOrderUpdated({ order, status }: ChangeStatusEvent) {
    const recipient = await this.recipientRepository.findById(
      order.recipientId.toString(),
    )

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: order.recipientId.toString(),
        title: `Atualização do status de sua encomenda para ${status}`,
        content: order.product,
      })
    }
  }
}
