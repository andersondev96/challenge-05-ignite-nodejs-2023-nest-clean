import { FetchOrderByDeliverymanUseCase } from '@/domain/fastfeet/application/use-cases/fetch-order-by-deliveryman'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { OrderWithDeliverymanAndRecipientPresenter } from '../presenters/order-with-deliveryman-and-recipient-presenter'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type pageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>

@Controller('/orders/deliveryman/:userId')
@Public()
export class FetchOrderByDeliverymanController {
  constructor(
    private fetchOrderByDeliveryman: FetchOrderByDeliverymanUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: pageQueryParamsSchema,
    @Param('userId') userId: string,
  ) {
    const result = await this.fetchOrderByDeliveryman.execute({
      userId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return {
      orders: orders.map(OrderWithDeliverymanAndRecipientPresenter.toHTTP),
    }
  }
}
