import { AuthenticateUseCase } from '@/domain/fastfeet/application/use-cases/authenticate'
import { CreateAccountUseCase } from '@/domain/fastfeet/application/use-cases/create-account'
import { CreateOrderUseCase } from '@/domain/fastfeet/application/use-cases/create-order'
import { CreateRecipientUseCase } from '@/domain/fastfeet/application/use-cases/create-recipient'
import { DeleteOrderUseCase } from '@/domain/fastfeet/application/use-cases/delete-order'
import { DeleteRecipientUseCase } from '@/domain/fastfeet/application/use-cases/delete-recipient'
import { DeleteUserUseCase } from '@/domain/fastfeet/application/use-cases/delete-user'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { DeleteOrderController } from './controllers/delete-order.controller'
import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { DeleteUserController } from './controllers/delete-user.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateRecipientController,
    CreateOrderController,
    DeleteOrderController,
    DeleteRecipientController,
    DeleteUserController,
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateUseCase,
    CreateRecipientUseCase,
    CreateOrderUseCase,
    DeleteOrderUseCase,
    DeleteRecipientUseCase,
    DeleteUserUseCase,
  ],
})
export class HttpModule {}
