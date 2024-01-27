import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHash } from 'test/cryptography/fake-hash'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { WrongCredentialsError } from './errors/WrongCredentialsError'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHash: FakeHash
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHash = new FakeHash()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUseCase(
      inMemoryUsersRepository,
      fakeHash,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate an user', async () => {
    const user = await MakeUser({
      cpf: '12345678',
      password: await fakeHash.hash('12345678'),
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      cpf: '12345678',
      password: '12345678',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate if user not exists', async () => {
    const createUser = await MakeUser({
      cpf: '123.456.789-00',
      password: '123456',
    })

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      cpf: '123.456.789-10',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate if password is incorrect', async () => {
    const createUser = await MakeUser({
      cpf: '123.456.789-00',
      password: '123456',
    })

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      cpf: '123.456.789-00',
      password: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
