import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { GetRecipientUseCase } from '@/domain/fastfeet/application/use-cases/get-recipient'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Param,
} from '@nestjs/common'

@Controller('/recipients/:recipientId')
export class GetRecipientController {
  constructor(private getRecipient: GetRecipientUseCase) {}

  @Get()
  async handle(
    @Param('recipientId') recipientId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    const result = await this.getRecipient.execute({
      userId,
      recipientId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { result }
  }
}
