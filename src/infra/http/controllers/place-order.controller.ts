import { PlaceOrderUseCase } from '@/domain/fastfeet/application/use-cases/place-order'
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
import { OrderPresenter } from '../presenters/order-presenter'

const placeOrderBodySchema = z.object({
  status: z.enum(['WAITING', 'WITHDRAWN', 'DELIVERED', 'RETURNED']),
  image: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(placeOrderBodySchema)

type placeOrderBodySchema = z.infer<typeof placeOrderBodySchema>

@Controller('/orders/place/:orderId')
export class PlaceOrderController {
  constructor(private placeOrder: PlaceOrderUseCase) {}

  @Put()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: placeOrderBodySchema,
    @Param('orderId') orderId: string,
  ) {
    const { status, image } = body

    const result = await this.placeOrder.execute({
      userId: user.sub,
      orderId,
      status,
      image,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { order: OrderPresenter.toHTTP(result.value.order) }
  }
}
