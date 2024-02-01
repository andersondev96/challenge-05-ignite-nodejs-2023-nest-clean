import { UpdateUserUseCase } from '@/domain/fastfeet/application/use-cases/update-user'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Put
} from '@nestjs/common'
import { z } from 'zod'

const updateUserBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateUserBodySchema)

type updateUserBodySchema = z.infer<typeof updateUserBodySchema>

@Controller('/users')
export class UpdateUserController {
  constructor(private updateUser: UpdateUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: updateUserBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, cpf, password } = body
    const userId = user.sub

    const result = await this.updateUser.execute({
      userId,
      name,
      cpf,
      password,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
