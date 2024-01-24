import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

const createRecipientBodySchema = z.object({
  name: z.string(),
  address: z.string(),
})

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/recipient')
export class CreateRecipientController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  async handle(
    @Body() body: CreateRecipientBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, address } = body
    const userId = user.sub

    await this.prismaService.recipient.create({
      data: {
        userId,
        name,
        address,
      },
    })
  }
}
