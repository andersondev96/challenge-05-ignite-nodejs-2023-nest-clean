import { AuthenticateUseCase } from '@/domain/fastfeet/application/use-cases/authenticate'
import { CreateAccountUseCase } from '@/domain/fastfeet/application/use-cases/create-account'
import { CreateOrderUseCase } from '@/domain/fastfeet/application/use-cases/create-order'
import { CreateRecipientUseCase } from '@/domain/fastfeet/application/use-cases/create-recipient'
import { DeleteOrderUseCase } from '@/domain/fastfeet/application/use-cases/delete-order'
import { DeleteRecipientUseCase } from '@/domain/fastfeet/application/use-cases/delete-recipient'
import { DeleteUserUseCase } from '@/domain/fastfeet/application/use-cases/delete-user'
import { FetchOrderByDeliverymanUseCase } from '@/domain/fastfeet/application/use-cases/fetch-order-by-deliveryman'
import { GetOrderUseCase } from '@/domain/fastfeet/application/use-cases/get-order'
import { GetProfileUserUseCase } from '@/domain/fastfeet/application/use-cases/get-profile'
import { GetRecipientUseCase } from '@/domain/fastfeet/application/use-cases/get-recipient'
import { PlaceOrderUseCase } from '@/domain/fastfeet/application/use-cases/place-order'
import { ResetPasswordUseCase } from '@/domain/fastfeet/application/use-cases/reset-password'
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
import { FetchOrderByDeliverymanController } from './controllers/fetch-order-by-deliveryman.controller'
import { GetOrderController } from './controllers/get-order.controller'
import { GetProfileController } from './controllers/get-profile.controller'
import { GetRecipientController } from './controllers/get-recipient.controller'
import { PlaceOrderController } from './controllers/place-order.controller'
import { ResetPasswordController } from './controllers/reset-password.controller'

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
    FetchOrderByDeliverymanController,
    GetOrderController,
    GetProfileController,
    GetRecipientController,
    PlaceOrderController,
    ResetPasswordController,
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateUseCase,
    CreateRecipientUseCase,
    CreateOrderUseCase,
    DeleteOrderUseCase,
    DeleteRecipientUseCase,
    DeleteUserUseCase,
    FetchOrderByDeliverymanUseCase,
    GetOrderUseCase,
    GetProfileUserUseCase,
    GetRecipientUseCase,
    PlaceOrderUseCase,
    ResetPasswordUseCase,
  ],
})
export class HttpModule {}
