import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface RecipientWithUserProps {
  userId: UniqueEntityId
  name: string
  nameUser: string
  cpf: string
  address: string
  createdAt: Date
  updatedAt?: Date | null
}

export class RecipientWithUser extends ValueObject<RecipientWithUserProps> {
  get userId() {
    return this.userId
  }

  get name() {
    return this.props.name
  }

  get nameUser() {
    return this.props.nameUser
  }

  get cpf() {
    return this.props.cpf
  }

  get address() {
    return this.props.address
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: RecipientWithUserProps) {
    return new RecipientWithUser(props)
  }
}
