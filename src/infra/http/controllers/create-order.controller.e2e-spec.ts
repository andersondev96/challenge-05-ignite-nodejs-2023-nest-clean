import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import request from 'supertest'
import { RecipientFactory } from 'test/factories/make-recipient'
import { UserFactory } from 'test/factories/make-user'

describe('Create Order Controller (E2E)', () => {
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

  test('[POST] / orders/:recipientId', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'ADMIN',
    })

    const deliveryman = await userFactory.makePrismaUser({
      role: 'DELIVERYMAN',
    })

    const recipient = await recipientFactory.makePrismaRecipient({
      userId: user.id,
    })

    const recipientId = recipient.id

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post(`/orders/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        product: 'Product example',
        details: 'Detail example',
      })

    expect(response.statusCode).toEqual(201)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        product: 'Product example',
      },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
