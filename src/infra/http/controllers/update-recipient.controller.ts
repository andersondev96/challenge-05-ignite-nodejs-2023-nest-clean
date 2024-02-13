import { UpdateRecipientUseCase } from '@/domain/fastfeet/application/use-cases/update-recipient'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

const updateRecipientBodySchema = z.object({
  name: z.string(),
  address: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateRecipientBodySchema)

type updateRecipientBodySchema = z.infer<typeof updateRecipientBodySchema>

@Controller('/recipients/:recipientId')
export class UpdateRecipientController {
  constructor(private updateRecipient: UpdateRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: updateRecipientBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('recipientId') recipientId: string,
  ) {
    const { name, address } = body
    const userId = user.sub

    const result = await this.updateRecipient.execute({
      userId,
      recipientId,
      name,
      address,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
