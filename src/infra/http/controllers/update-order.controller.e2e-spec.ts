import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { StatusOrder } from '@prisma/client'
import { AppModule } from 'src/infra/app.module'
import request from 'supertest'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'
import { UserFactory } from 'test/factories/make-user'

describe('Update Order Controller (E2E)', () => {
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

  test('[PUT] / orders/:orderId', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient({
      userId: user.id,
    })

    const order = await orderFactory.makePrismaOrder({
      deliverymanId: new UniqueEntityId(user.id.toString()),
      recipientId: new UniqueEntityId(recipient.id.toString()),
      product: 'Product example',
      details: 'Details example',
    })

    const orderId = order.id

    const response = await request(app.getHttpServer())
      .put(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        product: 'Product example 2',
        details: 'Details example 2',
        status: StatusOrder.DELIVERED,
        image: 'Image example',
      })

    expect(response.statusCode).toEqual(204)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        product: 'Product example 2',
        details: 'Details example 2',
      },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
