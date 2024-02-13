import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MakeOrder } from 'test/factories/make-order'
import { MakeRecipient } from 'test/factories/make-recipient'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FetchOrderByDeliverymanUseCase } from './fetch-order-by-deliveryman'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchOrderByDeliverymanUseCase

describe('Fetch Order By Deliveryman', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository(
      inMemoryUsersRepository,
    )
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryUsersRepository,
      inMemoryRecipientRepository,
    )
    sut = new FetchOrderByDeliverymanUseCase(inMemoryOrderRepository)
  })

  it('should be able to fetch order by deliveryman', async () => {
    const createNewUser = await MakeUser()

    await inMemoryUsersRepository.create(createNewUser)

    const createNewRecipient = await MakeRecipient({
      userId: createNewUser.id,
    })

    await inMemoryRecipientRepository.create(createNewRecipient)

    await inMemoryOrderRepository.create(
      await MakeOrder({
        recipientId: new UniqueEntityId(createNewRecipient.id.toString()),
        deliverymanId: new UniqueEntityId(createNewUser.id.toString()),
      }),
    )

    await inMemoryOrderRepository.create(
      await MakeOrder({
        recipientId: new UniqueEntityId(createNewRecipient.id.toString()),
        deliverymanId: new UniqueEntityId(createNewUser.id.toString()),
      }),
    )

    await inMemoryOrderRepository.create(
      await MakeOrder({
        recipientId: new UniqueEntityId(createNewRecipient.id.toString()),
        deliverymanId: new UniqueEntityId(createNewUser.id.toString()),
      }),
    )

    const result = await sut.execute({
      userId: createNewUser.id.toString(),
      page: 1,
    })

    expect(result.value?.orders).toHaveLength(3)
  })

  it('should be able to fetch pagination orders by deliveryman', async () => {
    const createNewUser = await MakeUser()

    inMemoryUsersRepository.create(createNewUser)

    const createNewRecipient = await MakeRecipient({
      userId: createNewUser.id,
    })

    await inMemoryRecipientRepository.create(createNewRecipient)

    for (let i = 0; i <= 22; i++) {
      await inMemoryOrderRepository.create(
        await MakeOrder({
          recipientId: new UniqueEntityId(createNewRecipient.id.toString()),
          deliverymanId: new UniqueEntityId(createNewUser.id.toString()),
        }),
      )
    }

    const result = await sut.execute({
      userId: createNewUser.id.toString(),
      page: 2,
    })

    expect(result.value?.orders).toHaveLength(3)
  })
})
