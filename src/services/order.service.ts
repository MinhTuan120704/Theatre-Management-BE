import Order from '../models/order.model';
import OrderProductDetails from '../models/orderProductDetails.model';
import Ticket from '../models/ticket.model';
const SeatService = require('./seat.service').SeatService;

export class OrderService {
  static async getOrderByUserId(userId: number) {
    return Order.findAll({ where: { userId } });
  }
  static async create(data: any) {
    const { products, tickets, ...orderData } = data;
    const transaction = (await Order.sequelize?.transaction()) ?? null;
    try {
      // Kiểm tra xem các ghế trong `tickets` đã bị đặt chưa bằng cách gọi SeatService.getByShowtimeId
      if (tickets && Array.isArray(tickets) && tickets.length > 0) {
        const pending = new Set<string>();
        for (const t of tickets) {
          const seats = await SeatService.getByShowtimeId(t.showtimeId);
          const seat = seats.find((s: any) => s.id === t.seatId);
          const key = `${t.showtimeId}:${t.seatId}`;
          if (seat && seat.isReserved) {
            throw new Error(`Seat ${t.seatId} already reserved for showtime ${t.showtimeId}`);
          }
          if (pending.has(key)) {
            throw new Error(`Duplicate seat ${t.seatId} for showtime ${t.showtimeId} in request`);
          }
          pending.add(key);
        }
      }

      // Tạo order
      const newOrder = await Order.create(orderData, { transaction });

      // Tạo orderProductDetails
      if (products && Array.isArray(products)) {
        for (const prod of products) {
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
    const transaction = (await Order.sequelize?.transaction()) ?? null;
    try {
      await Ticket.destroy({ where: { orderId: order_id }, transaction });
      await OrderProductDetails.destroy({ where: { orderId: order_id }, transaction });
      await order.destroy({ transaction });
      await transaction?.commit();
      return true;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }
}
