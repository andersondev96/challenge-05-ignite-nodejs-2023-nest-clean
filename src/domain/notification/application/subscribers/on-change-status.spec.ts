import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { StatusOrder } from '@prisma/client'
import { MakeOrder } from 'test/factories/make-order'
import { MakeRecipient } from 'test/factories/make-recipient'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { waitFor } from 'test/utils/waitFor'
import { MockInstance } from 'vitest'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnChangeStatus } from './on-change-status'

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpyOn: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Change Status Updated', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository(
      inMemoryUserRepository,
    )
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryUserRepository,
      inMemoryRecipientRepository,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpyOn = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnChangeStatus(inMemoryRecipientRepository, sendNotificationUseCase)
  })

  it('should send a notification when an order status is updated', async () => {
    const createRecipient = await MakeRecipient()
    const createOrder = await MakeOrder({
      recipientId: new UniqueEntityId(createRecipient.id.toString()),
    })

    await inMemoryRecipientRepository.create(createRecipient)
    await inMemoryOrderRepository.create(createOrder)

    createOrder.status = StatusOrder.DELIVERED

    await inMemoryOrderRepository.save(createOrder)

    await waitFor(() => {
      expect(sendNotificationExecuteSpyOn).toHaveBeenCalled()
    })
  }, 10000)
})
