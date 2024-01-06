import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { AppModule } from 'src/infra/app.module'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test('[POST] / sessions', async () => {
    await request(app.getHttpServer())
      .post('/user')
      .send({
        name: 'John Doe',
        cpf: '123456',
        password: await hash('123456', 8),
      })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      cpf: '123456',
      password: '123456',
    })

    console.log(response)

    expect(response.statusCode).toBe(201)
  })
})
