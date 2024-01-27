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

describe('Delete Order (E2E)', () => {
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

  test('[DELETE] / order / :orderId', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'ADMIN',
    })

    const recipient = await recipientFactory.makePrismaRecipient({
      userId: user.id,
    })

    const order = await orderFactory.makePrismaOrder({
      deliverymanId: user.id,
      recipientId: recipient.id,
    })

    const orderId = order.id.toString()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/order/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(204)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    expect(orderOnDatabase).toBeNull()
  })
})
