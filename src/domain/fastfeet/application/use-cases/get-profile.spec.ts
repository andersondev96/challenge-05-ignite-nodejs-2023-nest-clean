import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { GetProfileUserUseCase } from './get-profile'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetProfileUserUseCase

describe('Get Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetProfileUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to get user profile', async () => {
    const createUser = await MakeUser()

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items).toHaveLength(1)
  })

  it('should not be able to get profile an inexistent user', async () => {
    const result = await sut.execute({
      userId: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
