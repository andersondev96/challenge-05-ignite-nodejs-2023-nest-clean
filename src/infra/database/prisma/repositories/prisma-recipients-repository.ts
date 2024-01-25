import { RecipientsRepository } from '@/domain/fastfeet/application/repositories/recipients-repository'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/Recipient'
import { PrismaService } from '../prisma.service'

export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Recipient | null> {
    throw new Error('Method not implemented.')
  }

  async create(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
