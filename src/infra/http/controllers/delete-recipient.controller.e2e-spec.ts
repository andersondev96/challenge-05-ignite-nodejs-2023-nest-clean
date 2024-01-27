import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import request from 'supertest'
import { RecipientFactory } from 'test/factories/make-recipient'
import { UserFactory } from 'test/factories/make-user'

describe('Delete Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] / recipient / :recipientId', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'ADMIN',
    })

    const recipient = await recipientFactory.makePrismaRecipient({
      userId: user.id,
    })

    const recipientId = recipient.id.toString()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/recipient/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(204)

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        id: recipientId,
      },
    })

    expect(recipientOnDatabase).toBeNull()
  })
})
