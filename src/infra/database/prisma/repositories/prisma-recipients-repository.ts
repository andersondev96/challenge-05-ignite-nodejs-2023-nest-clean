import { RecipientsRepository } from '@/domain/fastfeet/application/repositories/recipients-repository'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/Recipient'
import { RecipientWithUser } from '@/domain/fastfeet/enterprise/entities/value-objects/recipient-with-user'
import { Injectable } from '@nestjs/common'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'
import { PrismaRecipientWithUserMapper } from '../mappers/prisma-recipient-with-user'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<RecipientWithUser | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientWithUserMapper.toDomain(recipient)
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.create({
      data,
    })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.delete({
      where: {
        id: data.id,
      },
    })
  }
}
