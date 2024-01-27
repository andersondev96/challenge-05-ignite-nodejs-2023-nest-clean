import { FakeHash } from 'test/cryptography/fake-hash'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UserNotFoundError } from './errors/UserNotFoundError'
import { UpdateUserUseCase } from './update-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHash: FakeHash
let sut: UpdateUserUseCase

describe('Update User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHash = new FakeHash()
    sut = new UpdateUserUseCase(inMemoryUsersRepository, fakeHash)
  })

  it('should be able to update an user', async () => {
    const createUser = await MakeUser()

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      name: 'John Doe',
      cpf: '123.456.789-00',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to update an inexistent user', async () => {
    const result = await sut.execute({
      userId: '123456',
      name: 'John Doe',
      cpf: '123.456.789-00',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotFoundError)
  })
})
