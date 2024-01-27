import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeRecipient } from 'test/factories/make-recipient'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { GetRecipientUseCase } from './get-recipient'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRecipientsRepository: InMemoryRecipientRepository
let sut: GetRecipientUseCase

describe('Update Recipient', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientRepository()
    sut = new GetRecipientUseCase(
      inMemoryUsersRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to update recipient', async () => {
    const createUser = await MakeUser({
      role: 'ADMIN',
    })
    const createRecipient = await MakeRecipient()

    inMemoryUsersRepository.create(createUser)
    inMemoryRecipientsRepository.create(createRecipient)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      recipientId: createRecipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items).toHaveLength(1)
  })

  it('should not be able to update recipient if user not found', async () => {
    const result = await sut.execute({
      userId: '123456',
      recipientId: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update recipient if user not is admin', async () => {
    const createUser = await MakeUser({
      role: 'DELIVERYMAN',
    })

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      recipientId: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to update recipient not found', async () => {
    const createUser = await MakeUser({
      role: 'ADMIN',
    })

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      recipientId: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
