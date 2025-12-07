import Order from '../models/order.model';

export class OrderService {
  static async create(data: any) {
    return Order.create(data);
  }

  static async getAll() {
    return Order.findAll();
  }

  static async getById(order_id: number) {
    return Order.findByPk(order_id);
  }

  static async update(order_id: number, data: Partial<Order>) {
    const order = await Order.findByPk(order_id);
    if (!order) return null;
    return order.update(data);
  }

  static async delete(order_id: number) {
    const order = await Order.findByPk(order_id);
    if (!order) return null;
    await order.destroy();
    return true;
  }
}
