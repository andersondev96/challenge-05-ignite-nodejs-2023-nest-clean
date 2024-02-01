import { UpdateOrderUseCase } from '@/domain/fastfeet/application/use-cases/update-order'
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

const updateOrderBodySchema = z.object({
  product: z.string(),
  details: z.string(),
  status: z.enum(['WAITING', 'WITHDRAWN', 'DELIVERED', 'RETURNED']),
  image: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateOrderBodySchema)

type updateOrderBodySchema = z.infer<typeof updateOrderBodySchema>

@Controller('/orders/:orderId')
export class UpdateOrderController {
  constructor(private updateOrder: UpdateOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: updateOrderBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { product, details, status, image } = body
    const userId = user.sub

    const result = await this.updateOrder.execute({
      orderId,
      deliverymanId: userId,
      product,
      details,
      status,
      image,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
