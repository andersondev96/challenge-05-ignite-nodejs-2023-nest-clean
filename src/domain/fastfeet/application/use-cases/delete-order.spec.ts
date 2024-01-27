import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeOrder } from 'test/factories/make-order'
import { MakeRecipient } from 'test/factories/make-recipient'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { DeleteOrderUseCase } from './delete-order'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: DeleteOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new DeleteOrderUseCase(
      inMemoryUsersRepository,
      inMemoryOrderRepository,
    )
  })

  it('should be able to delete order', async () => {
    const createUser = await MakeUser({
      role: 'ADMIN',
    })
    const createRecipient = await MakeRecipient()

    const createOrder = await MakeOrder({
      deliverymanId: new UniqueEntityId(createUser.id.toString()),
      recipientId: new UniqueEntityId(createRecipient.id.toString()),
    })

    inMemoryUsersRepository.create(createUser)
    inMemoryOrderRepository.create(createOrder)

    await sut.execute({
      userId: createUser.id.toString(),
      orderId: createOrder.id.toString(),
    })

    expect(inMemoryOrderRepository.items).toHaveLength(0)
  })

  it('should not be able to delete order if user not found', async () => {
    const result = await sut.execute({
      userId: '123456',
      orderId: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete order if user not is admin', async () => {
    const createUser = await MakeUser({
      role: 'DELIVERYMAN',
    })

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      orderId: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete order not found', async () => {
    const createUser = await MakeUser({
      role: 'ADMIN',
    })

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      orderId: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
