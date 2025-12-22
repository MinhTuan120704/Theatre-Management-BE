import Order from '../models/order.model';
import OrderProductDetails from '../models/orderProductDetails.model';
import Ticket from '../models/ticket.model';
import User from '../models/user.model';
import Movie from '../models/movie.model';
import Cinema from '../models/cinema.model';
import Room from '../models/room.model';
import Seat from '../models/seat.model';
import Product from '../models/product.model';
import Showtime from '../models/showTime.model';
import EmailService from './email.service';
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

      // Gửi email xác nhận
      try {
        const user = await User.findByPk(orderData.userId);
        if (user && user.email) {
          // Lấy thông tin showtime (giả sử tất cả tickets cùng showtime)
          const showtimeId = tickets[0]?.showtimeId;
          let showtime = null as any;
          if (showtimeId) {
            showtime = await Showtime.findByPk(showtimeId);
          }

          // Nếu associations không được populate, fetch riêng
          let movie = null as any;
          let room = null as any;
          let cinema = null as any;
          if (showtime) {
            if (showtime.movieId) {
              movie = await Movie.findByPk(showtime.movieId, { attributes: ['title'] });
            }
            if (showtime.roomId) {
              room = await Room.findByPk(showtime.roomId, { attributes: ['name', 'cinemaId'] });
              if (room && room.cinemaId) {
                cinema = await Cinema.findByPk(room.cinemaId, { attributes: ['name', 'address'] });
              }
            }
          }

          // Lấy danh sách vé
          const ticketDetails: Array<any> = [];
          for (const t of tickets) {
            const seat = await Seat.findByPk(t.seatId, { attributes: ['seatNumber'] });
            ticketDetails.push({ seat: seat?.seatNumber || 'Unknown', price: showtime?.price || 0 });
          }

          // Lấy danh sách sản phẩm
          const productDetails: Array<any> = [];
          if (products && Array.isArray(products)) {
            for (const prod of products) {
              const product = await Product.findByPk(prod.productId, { attributes: ['name', 'price'] });
              if (product) {
                productDetails.push({ name: product.name, quantity: prod.quantity, price: product.price });
              }
            }
          }

          const orderDetails = {
            customerName: user?.fullName || user?.email || 'Khách hàng',
            movieTitle: movie?.title || 'Unknown',
            cinemaName: cinema?.name || 'Unknown',
            cinemaAddress: cinema?.address || 'Unknown',
            roomName: room?.name || 'Unknown',
            ticketPrice: showtime?.price || 0,
            showtime: showtime ? new Date(showtime.showTime).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'Unknown',
            tickets: ticketDetails,
            products: productDetails,
            totalPrice: (newOrder && (newOrder as any).totalPrice) || orderData.totalPrice || 0,
          };

          await EmailService.sendBookingConfirmation(user.email, orderDetails);
        }
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Không throw error để không làm fail order
      }

      return newOrder;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  static async getAll(limit?: number, offset?: number) {
    const options: any = {};
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;
    const { count, rows } = await Order.findAndCountAll(options);
    return { orders: rows, total: count };
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
