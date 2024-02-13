import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { GetOrderUseCase } from '@/domain/fastfeet/application/use-cases/get-order'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Param,
} from '@nestjs/common'
import { OrderPresenter } from '../presenters/order-presenter'

@Controller('/orders/:orderId')
export class GetOrderController {
  constructor(private getOrder: GetOrderUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const userId = user.sub

    const result = await this.getOrder.execute({
      userId,
      orderId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error.message)
        case NotAllowedError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { order: OrderPresenter.toHTTP(result.value.order) }
  }
}
