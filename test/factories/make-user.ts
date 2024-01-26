import { User, UserProps } from '@/domain/fastfeet/enterprise/entities/User'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

export async function MakeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const userType: 'DELIVERYMAN' | 'ADMIN' = 'DELIVERYMAN'

  const hashPassword = await hash('123456', 6)

  const user = User.create(
    {
      name: faker.person.firstName(),
      cpf: faker.string.uuid(),
      password: hashPassword,
      role: userType,
      ...override,
    },
    id,
  )

  return user
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = await MakeUser(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    return user
  }
}
