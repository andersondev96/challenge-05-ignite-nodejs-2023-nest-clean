import { AuthenticateUseCase } from '@/domain/fastfeet/application/use-cases/authenticate'
import { CreateAccountUseCase } from '@/domain/fastfeet/application/use-cases/create-account'
import { CreateRecipientUseCase } from '@/domain/fastfeet/application/use-cases/create-recipient'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateRecipientController } from './controllers/create-recipient.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateRecipientController,
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateUseCase,
    CreateRecipientUseCase,
  ],
})
export class HttpModule {}
