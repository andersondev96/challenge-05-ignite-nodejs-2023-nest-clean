import { CreateRecipientUseCase } from '@/domain/fastfeet/application/use-cases/create-recipient'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createRecipientBodySchema = z.object({
  name: z.string(),
  address: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema)

type createRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/recipients')
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: createRecipientBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, address } = body
    const userId = user.sub

    const result = await this.createRecipient.execute({
      userId,
      name,
      address,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
