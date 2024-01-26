import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface RecipientProps {
  name: string
  address: string
  userId: UniqueEntityId
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get address() {
    return this.props.address
  }

  set address(address: string) {
    this.props.address = address
  }

  get userId() {
    return this.props.userId
  }

  set userId(userId: UniqueEntityId) {
    this.props.userId = userId
  }

  static create(props: RecipientProps, id?: UniqueEntityId) {
    const recipient = new Recipient(props, id)

    return recipient
  }
}
