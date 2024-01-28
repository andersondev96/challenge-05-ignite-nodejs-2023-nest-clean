import { Order } from '@/domain/fastfeet/enterprise/entities/Order'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      product: order.product,
      details: order.details,
      status: order.status,
      withdrawnDate: order.withdrawDate,
      deliveryDate: order.deliveryDate,
      image: order.image,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
