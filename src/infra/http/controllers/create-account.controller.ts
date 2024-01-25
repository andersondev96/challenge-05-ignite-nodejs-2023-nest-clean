import { CreateAccountUseCase } from '@/domain/fastfeet/application/use-cases/create-account'
import { UserAlreadyExistsError } from '@/domain/fastfeet/application/use-cases/errors/UserAlreadyExistsError'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
  role: z.enum(['ADMIN', 'DELIVERYMAN']).default('ADMIN'),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/user')
export class CreateAccountController {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, cpf, password, role } = body

    const result = await this.createAccountUseCase.execute({
      name,
      cpf,
      password,
      role,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
