import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Delete User (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] / user / :userId', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'ADMIN',
    })

    const userId = user.id.toString()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    expect(userOnDatabase).toBeNull()
  })
})
