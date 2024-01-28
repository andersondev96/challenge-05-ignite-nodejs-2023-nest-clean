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

describe('Fetch order by deliveryman controller (E2E)', () => {
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

  test('[GET] / orders/deliveryman', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'DELIVERYMAN',
    })

    const recipient = await recipientFactory.makePrismaRecipient({
      userId: user.id,
    })

    await orderFactory.makePrismaOrder({
      deliverymanId: user.id,
      recipientId: recipient.id,
      product: 'product 01',
    })

    await orderFactory.makePrismaOrder({
      deliverymanId: user.id,
      recipientId: recipient.id,
      product: 'product 02',
    })

    await orderFactory.makePrismaOrder({
      deliverymanId: user.id,
      recipientId: recipient.id,
      product: 'product 03',
    })

    const userId = user.id

    const response = await request(app.getHttpServer()).get(
      `/orders/deliveryman/${userId}`,
    )

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          product: 'product 01',
        }),
        expect.objectContaining({
          product: 'product 02',
        }),
        expect.objectContaining({
          product: 'product 03',
        }),
      ]),
    })
  })
})
