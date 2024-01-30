import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { AppModule } from 'src/infra/app.module'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Reset Password Controller (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /sessions/reset-password', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'John Doe',
      cpf: '123456',
      password: await hash('123456', 8),
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .patch('/sessions/reset-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        cpf: '123456',
        oldPassword: '123456',
        newPassword: '12345678',
      })

    expect(response.statusCode).toEqual(204)
  })
})
