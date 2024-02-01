import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { AppModule } from 'src/infra/app.module'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Update User Controller (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] / users', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'ADMIN',
      name: 'John Doe',
      cpf: '123456',
      password: '123456',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .put(`/users`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Mary Doe',
        cpf: '12345678',
        password: await hash('12345678', 8),
      })

    expect(response.statusCode).toEqual(204)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        name: 'Mary Doe',
        cpf: '12345678',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
