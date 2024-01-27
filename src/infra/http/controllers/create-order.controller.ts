import { CreateOrderUseCase } from '@/domain/fastfeet/application/use-cases/create-order'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

const createOrderBodySchema = z.object({
  product: z.string(),
  details: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

type createOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders/:recipientId')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: createOrderBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('recipientId') recipientId: string,
  ) {
    const { product, details } = body
    const userId = user.sub

    const result = await this.createOrder.execute({
      deliverymanId: userId,
      recipientId,
      product,
      details,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
