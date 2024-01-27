import { UserCaseError } from '@/core/errors/use-case-error'

export class UserNotFoundError extends Error implements UserCaseError {
  constructor() {
    super(`User not found`)
  }
}
