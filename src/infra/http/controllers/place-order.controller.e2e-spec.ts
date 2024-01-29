import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import request from 'supertest'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'
import { UserFactory } from 'test/factories/make-user'

describe('Place Order Controller (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] / orders/place/:orderId', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient({
      userId: user.id,
    })

    const order = await orderFactory.makePrismaOrder({
      deliverymanId: user.id,
      recipientId: recipient.id,
    })

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/orders/place/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'WITHDRAWN',
        image: 'image.png',
      })

    expect(response.statusCode).toEqual(201)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        status: 'WITHDRAWN',
      },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
