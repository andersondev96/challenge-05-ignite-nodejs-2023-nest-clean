import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateRecipientUseCase } from './create-recipient'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: CreateRecipientUseCase

describe('Create recipient', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new CreateRecipientUseCase(
      inMemoryUsersRepository,
      inMemoryRecipientRepository,
    )
  })

  it('should be able to  create a new recipient', async () => {
    const user = await MakeUser({
      role: 'ADMIN',
    })

    inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'John Doe',
      address: 'Address Example',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryUsersRepository.items.length).toBe(1)
  })

  it('should not be able to  create a new recipient if user not found', async () => {
    const result = await sut.execute({
      userId: '123456',
      name: 'John Doe',
      address: 'Address Example',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to  create a new recipient if user not is admin', async () => {
    const user = await MakeUser({
      role: 'DELIVERYMAN',
    })

    inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'John Doe',
      address: 'Address Example',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
