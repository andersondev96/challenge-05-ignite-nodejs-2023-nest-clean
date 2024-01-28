import { DeleteUserUseCase } from '@/domain/fastfeet/application/use-cases/delete-user'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/user/:userId')
export class DeleteUserController {
  constructor(private deleteUser: DeleteUserUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('userId') userId: string,
  ) {
    const result = await this.deleteUser.execute({
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
