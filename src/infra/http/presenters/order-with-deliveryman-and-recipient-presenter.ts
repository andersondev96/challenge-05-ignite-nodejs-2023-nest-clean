import { OrderWithDeliverymanAndRecipient } from '@/domain/fastfeet/enterprise/entities/value-objects/order-with-deliveryman-and-recipient'

export class OrderWithDeliverymanAndRecipientPresenter {
  static toHTTP(
    orderWithDeliverymanAndRecipient: OrderWithDeliverymanAndRecipient,
  ) {
    return {
      recipientId: orderWithDeliverymanAndRecipient.recipientId.toString(),
      recipientName: orderWithDeliverymanAndRecipient.recipientName,
      deliverymanId: orderWithDeliverymanAndRecipient.deliverymanId.toString(),
      deliverymanName: orderWithDeliverymanAndRecipient.deliverymanName,
      product: orderWithDeliverymanAndRecipient.product,
      details: orderWithDeliverymanAndRecipient.details,
      status: orderWithDeliverymanAndRecipient.status,
      withdrawnDate: orderWithDeliverymanAndRecipient.withdrawnDate,
      deliveryDate: orderWithDeliverymanAndRecipient.deliveryDate,
      image: orderWithDeliverymanAndRecipient.image,
    }
  }
}
