import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateAccountController, AuthenticateController],
})
export class HttpModule {}
