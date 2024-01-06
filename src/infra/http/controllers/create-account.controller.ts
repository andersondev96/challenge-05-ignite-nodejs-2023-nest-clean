import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/user')
export class CreateAccountController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, cpf, password } = body

    await this.prismaService.user.create({
      data: {
        name,
        cpf,
        password,
      },
    })
  }
}
