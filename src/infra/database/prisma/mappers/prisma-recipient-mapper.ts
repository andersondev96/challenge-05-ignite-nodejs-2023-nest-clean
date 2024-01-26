import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/Recipient'
import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        address: raw.address,
        userId: new UniqueEntityId(raw.userId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      address: recipient.address,
      userId: recipient.userId.toString(),
    }
  }
}
