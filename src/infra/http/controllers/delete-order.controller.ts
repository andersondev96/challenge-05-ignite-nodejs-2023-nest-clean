import { DeleteOrderUseCase } from '@/domain/fastfeet/application/use-cases/delete-order'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'

@Controller('/order/:orderId')
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteOrder.execute({
      userId,
      orderId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
