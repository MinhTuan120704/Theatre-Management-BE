import Order from '../models/order.model';

export class OrderService {
  static async getOrderByUserId(userId: number) {
    return Order.findAll({ where: { userId } });
  }
  static async create(data: any) {
    const { products, tickets, ...orderData } = data;
    const transaction = (await Order.sequelize?.transaction()) ?? null;
    try {
      // Tạo order
      const newOrder = await Order.create(orderData, { transaction });

      // Tạo orderProductDetails
      if (products && Array.isArray(products)) {
        for (const prod of products) {
          const OrderProductDetails = require('../models/orderProductDetails.model').default;
          await OrderProductDetails.create({
            orderId: newOrder.id,
            productId: prod.productId,
            quantity: prod.quantity
          }, { transaction });
        }
      }

      // Tạo tickets
      if (tickets && Array.isArray(tickets)) {
        for (const t of tickets) {
          const Ticket = require('../models/ticket.model').default;
          await Ticket.create({
            orderId: newOrder.id,
            showtimeId: t.showtimeId,
            seatId: t.seatId
          }, { transaction });
        }
      }

      await transaction?.commit();
      return newOrder;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
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
