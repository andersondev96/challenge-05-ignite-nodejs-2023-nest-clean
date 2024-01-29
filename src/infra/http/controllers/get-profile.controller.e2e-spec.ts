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

describe('Get profile controller (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] / profile', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'John Doe',
      role: 'DELIVERYMAN',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/profile`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        name: 'John Doe',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
