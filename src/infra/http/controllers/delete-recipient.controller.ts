import { DeleteRecipientUseCase } from '@/domain/fastfeet/application/use-cases/delete-recipient'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/recipient/:recipientId')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('recipientId') recipientId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteRecipient.execute({
      userId,
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
