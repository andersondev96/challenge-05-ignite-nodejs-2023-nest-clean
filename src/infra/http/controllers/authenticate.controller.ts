import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { compare } from 'bcryptjs'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const user = await this.prismaService.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!user) {
      throw new Error(`User not found`)
    }

    const compareHash = await compare(password, user.password)

    if (!compareHash) {
      throw new Error(`Invalid credentials`)
    }

    return user.id
  }
}
