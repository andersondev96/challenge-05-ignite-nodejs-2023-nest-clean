import { ResetPasswordUseCase } from '@/domain/fastfeet/application/use-cases/reset-password'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'

const resetPasswordBodySchema = z.object({
  cpf: z.string(),
  oldPassword: z.string(),
  newPassword: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(resetPasswordBodySchema)

type resetPasswordBodySchema = z.infer<typeof resetPasswordBodySchema>

@Controller('/sessions/reset-password')
export class ResetPasswordController {
  constructor(private resetPassword: ResetPasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: resetPasswordBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { cpf, oldPassword, newPassword } = body
    const userId = user.sub

    const result = await this.resetPassword.execute({
      userId,
      cpf,
      oldPassword,
      newPassword,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
