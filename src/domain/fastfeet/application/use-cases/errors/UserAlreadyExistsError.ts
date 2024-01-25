import { UserCaseError } from '@/core/errors/use-case-error'

export class UserAlreadyExistsError extends Error implements UserCaseError {
  constructor(identifier: string) {
    super(`User "${identifier}" already exists.`)
  }
}
