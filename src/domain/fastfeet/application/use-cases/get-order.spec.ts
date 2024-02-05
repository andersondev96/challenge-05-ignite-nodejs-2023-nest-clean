import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeOrder } from 'test/factories/make-order'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { GetOrderUseCase } from './get-order'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRecipientsRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: GetOrderUseCase

describe('Get Order', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientRepository(
      inMemoryUsersRepository,
    )
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryUsersRepository,
      inMemoryRecipientsRepository,
    )
    sut = new GetOrderUseCase(inMemoryOrderRepository)
  })

  it('should be able to get order', async () => {
    const createUser = await MakeUser({
      role: 'ADMIN',
    })

    const createOrder = await MakeOrder()

    await inMemoryUsersRepository.create(createUser)
    await inMemoryOrderRepository.create(createOrder)

    const result = await sut.execute({
      orderId: createOrder.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
  })

  it('should not be able to get order if user not found', async () => {
    const createOrder = await MakeOrder()
    await inMemoryOrderRepository.create(createOrder)

    const result = await sut.execute({
      orderId: createOrder.id.toString(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to  create a new order if user not is admin', async () => {
    const createUser = await MakeUser({
      role: 'DELIVERYMAN',
    })
    const createOrder = await MakeOrder()

    await inMemoryUsersRepository.create(createUser)
    await inMemoryOrderRepository.create(createOrder)

    const result = await sut.execute({
      orderId: createOrder.id.toString(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
