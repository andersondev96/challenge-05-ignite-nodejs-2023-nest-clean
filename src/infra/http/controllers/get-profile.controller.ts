import { GetProfileUserUseCase } from '@/domain/fastfeet/application/use-cases/get-profile'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BadRequestException, Controller, Get } from '@nestjs/common'

@Controller('/profile')
export class GetProfileController {
  constructor(private getProfile: GetProfileUserUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub
    const result = await this.getProfile.execute({
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { result }
  }
}
