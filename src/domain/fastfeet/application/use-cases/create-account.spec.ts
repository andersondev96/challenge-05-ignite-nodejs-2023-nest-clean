import { FakeHash } from 'test/cryptography/fake-hash'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateAccountUseCase } from './create-account'
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHash: FakeHash
let sut: CreateAccountUseCase

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHash = new FakeHash()
    sut = new CreateAccountUseCase(inMemoryUsersRepository, fakeHash)
  })

  it('should be able to create a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.456.789-00',
      password: '123456',
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.456.789-00',
      password: '123456',
      role: 'ADMIN',
    })

    const hashedPassword = await fakeHash.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to create an user if user already exists', async () => {
    const newUser = await MakeUser({
      cpf: '123.456.789-00',
    })

    await inMemoryUsersRepository.create(newUser)

    const result = await sut.execute({
      name: 'John Doe',
      cpf: newUser.cpf,
      password: '123456',
      role: 'ADMIN',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
