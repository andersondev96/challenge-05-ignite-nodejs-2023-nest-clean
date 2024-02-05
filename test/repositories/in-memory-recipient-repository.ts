import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { RecipientsRepository } from '@/domain/fastfeet/application/repositories/recipients-repository'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/Recipient'
import { RecipientWithUser } from '@/domain/fastfeet/enterprise/entities/value-objects/recipient-with-user'
import { InMemoryUsersRepository } from './in-memory-users-repository'

export class InMemoryRecipientRepository implements RecipientsRepository {
  public items: Recipient[] = []

  constructor(private usersRepository: InMemoryUsersRepository) {}

  async findById(id: string) {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    const user = await this.usersRepository.findById(
      recipient.userId.toString(),
    )

    if (!user) {
      return null
    }

    return RecipientWithUser.create({
      userId: new UniqueEntityId(recipient.userId.toString()),
      name: recipient.name,
      nameUser: user.name,
      cpf: user.cpf,
      address: recipient.address,
    })
  }

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }

  async delete(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items.splice(itemIndex, 1)
  }
}
