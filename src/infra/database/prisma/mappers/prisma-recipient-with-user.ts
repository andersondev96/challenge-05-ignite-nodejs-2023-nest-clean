import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { RecipientWithUser } from '@/domain/fastfeet/enterprise/entities/value-objects/recipient-with-user'
import {
  Recipient as PrismaRecipient,
  User as PrismaUser,
} from '@prisma/client'

type PrismaRecipientWithUser = PrismaRecipient & {
  user: PrismaUser
}

export class PrismaRecipientWithUserMapper {
  static toDomain(raw: PrismaRecipientWithUser): RecipientWithUser {
    return RecipientWithUser.create({
      userId: new UniqueEntityId(raw.userId),
      name: raw.name,
      nameUser: raw.user.name,
      cpf: raw.user.cpf,
      address: raw.address,
    })
  }
}
