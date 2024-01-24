import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { AppModule } from 'src/infra/app.module'
import request from 'supertest'

describe('Create Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] / recipient', async () => {
    await request(app.getHttpServer())
      .post('/user')
      .send({
        name: 'John Doe',
        cpf: '123456',
        password: await hash('123456', 8),
      })

    await request(app.getHttpServer()).post('/sessions').send({
      cpf: '123456',
      password: '123456',
    })

    const result = await request(app.getHttpServer()).post(`/recipient`).send({
      name: 'John Doe',
      address: 'Example',
    })

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: 'John Doe',
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
