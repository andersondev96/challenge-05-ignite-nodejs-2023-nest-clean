import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MakeOrder } from 'test/factories/make-order'
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
    beforeEach(() => {
      inMemoryUsersRepository = new InMemoryUsersRepository()
      inMemoryRecipientRepository = new InMemoryRecipientRepository(
        inMemoryUsersRepository,
      )
      inMemoryOrderRepository = new InMemoryOrderRepository(
        inMemoryUsersRepository,
        inMemoryRecipientRepository,
      )
    })
    sut = new FetchOrderByDeliverymanUseCase(inMemoryOrderRepository)
  })

  it('should be able to fetch order by deliveryman', async () => {
    await inMemoryOrderRepository.create(
      await MakeOrder({
        deliverymanId: new UniqueEntityId('user-1'),
      }),
    )

    await inMemoryOrderRepository.create(
      await MakeOrder({
        deliverymanId: new UniqueEntityId('user-1'),
      }),
    )

    await inMemoryOrderRepository.create(
      await MakeOrder({
        deliverymanId: new UniqueEntityId('user-1'),
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
    })

    expect(result.value?.orders).toHaveLength(3)
  })

  it('should be able to fetch pagination orders by deliveryman', async () => {
    for (let i = 0; i <= 22; i++) {
      await inMemoryOrderRepository.create(
        await MakeOrder({
          deliverymanId: new UniqueEntityId('user-1'),
        }),
      )
    }

    const result = await sut.execute({
      userId: 'user-1',
      page: 2,
    })

    expect(result.value?.orders).toHaveLength(3)
  })
})
