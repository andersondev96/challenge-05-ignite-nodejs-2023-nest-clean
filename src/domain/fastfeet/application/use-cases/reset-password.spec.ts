import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { FakeHash } from 'test/cryptography/fake-hash'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { ResetPasswordUseCase } from './reset-password'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHash: FakeHash
let sut: ResetPasswordUseCase

describe('Reset Password', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHash = new FakeHash()
    sut = new ResetPasswordUseCase(inMemoryUsersRepository, fakeHash, fakeHash)
  })

  it('should be able to reset password', async () => {
    const createUser = await MakeUser({
      cpf: '123.456.789-00',
      role: 'ADMIN',
    })

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      cpf: '123.456.789-00',
      oldPassword: '123456',
      newPassword: '12345678',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to reset password if user not found', async () => {
    const result = await sut.execute({
      userId: '123456',
      cpf: '123.456.789-00',
      oldPassword: '123456',
      newPassword: '12345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to reset password if user not is admin', async () => {
    const userLogged = await MakeUser({
      name: 'User Logged',
      cpf: '111.111.111.111',
      password: '12345678',
      role: 'DELIVERYMAN',
    })

    inMemoryUsersRepository.create(userLogged)

    const createUser = await MakeUser({
      cpf: '123.456.789-00',
      role: 'DELIVERYMAN',
    })

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      userId: userLogged.id.toString(),
      cpf: '123.456.789-00',
      oldPassword: '123456',
      newPassword: '12345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
