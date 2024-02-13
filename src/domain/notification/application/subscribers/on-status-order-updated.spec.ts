import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { StatusOrder } from '@prisma/client'
import { MakeOrder } from 'test/factories/make-order'
import { MakeRecipient } from 'test/factories/make-recipient'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { waitFor } from 'test/utils/waitFor'
import { SpyInstance } from 'vitest'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnStatusOrderUpdated } from './on-status-order-updated'

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let notificationRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpyOn: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Status Order Updated', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository(inMemoryUserRepository)
    inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryUserRepository, inMemoryRecipientRepository)
    notificationRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationRepository,
    )

    sendNotificationExecuteSpyOn = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnStatusOrderUpdated(inMemoryOrderRepository, sendNotificationUseCase)
  })

  it('should send a notification when an order status is updated', async () => {
    const createUser = await MakeUser({
      role: 'ADMIN',
    })

    const createRecipient = await MakeRecipient()

    const createOrder = await MakeOrder({
      deliverymanId: new UniqueEntityId(createUser.id.toString()),
      recipientId: new UniqueEntityId(createRecipient.id.toString()),
    })

    await inMemoryOrderRepository.create(createOrder)

    createOrder.status = StatusOrder.DELIVERED

    await inMemoryOrderRepository.save(createOrder)

    await waitFor(() => {
      expect(sendNotificationExecuteSpyOn).toHaveBeenCalled()
    })
  })
})
