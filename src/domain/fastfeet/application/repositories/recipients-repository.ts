import { Recipient } from '../../enterprise/entities/Recipient'
import { RecipientWithUser } from '../../enterprise/entities/value-objects/recipient-with-user'

export abstract class RecipientsRepository {
  abstract findById(id: string): Promise<RecipientWithUser | null>
  abstract create(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
}
