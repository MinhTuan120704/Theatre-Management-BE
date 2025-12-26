import Order from "../models/order.model";
import OrderProductDetails from "../models/orderProductDetails.model";
import Ticket from "../models/ticket.model";
import User from "../models/user.model";
import Movie from "../models/movie.model";
import Cinema from "../models/cinema.model";
import Room from "../models/room.model";
import Seat from "../models/seat.model";
import Product from "../models/product.model";
import Showtime from "../models/showTime.model";
import EmailService from "./email.service";

export class OrderService {
  static async getOrderByUserId(userId: number) {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: Ticket,
          as: "tickets",
          include: [
            {
              model: Showtime,
              as: "showtime",
              include: [
                {
                  model: Movie,
                  as: "movie",
                  attributes: ["id", "title"],
                },
                {
                  model: Room,
                  as: "room",
                  attributes: ["id", "name"],
                  include: [
                    {
                      model: Cinema,
                      as: "cinema",
                      attributes: ["id", "name", "address"],
                    },
                  ],
                },
              ],
            },
            {
              model: Seat,
              as: "seat",
              attributes: ["id", "seatNumber"],
            },
          ],
        },
        {
          model: OrderProductDetails,
          as: "orderProductDetails",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
    });

    // Format lại dữ liệu trả về
    return orders.map((order: any) => {
      const orderData = order.toJSON();
      const firstTicket = orderData.tickets?.[0];
      const showtime = firstTicket?.showtime;
      const movie = showtime?.movie;
      const room = showtime?.room;
      const cinema = room?.cinema;

      return {
        id: orderData.id,
        userId: orderData.userId,
        totalPrice: orderData.totalPrice,
        paymentMethod: orderData.paymentMethod,
        status: orderData.status,
        reservationExpiresAt: orderData.reservationExpiresAt,
        paidAt: orderData.paidAt,
        discountId: orderData.discountId,
        orderedAt: orderData.orderedAt,
        // Thông tin phim
        movieId: movie?.id || null,
        movieTitle: movie?.title || null,
        // Thông tin rạp
        cinemaId: cinema?.id || null,
        cinemaName: cinema?.name || null,
        cinemaAddress: cinema?.address || null,
        // Thông tin phòng
        roomId: room?.id || null,
        roomName: room?.name || null,
        // Thời gian chiếu
        showTime: showtime?.showTime || null,
        // Danh sách ghế
        seats:
          orderData.tickets?.map((ticket: any) => ({
            seatId: ticket.seat?.id,
            seatNumber: ticket.seat?.seatNumber,
          })) || [],
        // Danh sách sản phẩm
        products:
          orderData.orderProductDetails?.map((detail: any) => ({
            productId: detail.product?.id,
            productName: detail.product?.name,
            productPrice: detail.product?.price,
            quantity: detail.quantity,
          })) || [],
      };
    });
  }
  static async create(data: any) {
    const { products, tickets, ...orderData } = data;
    const transaction = (await Order.sequelize?.transaction()) ?? null;
    try {
      // Kiểm tra xem các ghế trong `tickets` đã bị đặt chưa bằng cách check Ticket.isReserved
      if (tickets && Array.isArray(tickets) && tickets.length > 0) {
        const pending = new Set<string>();
        for (const t of tickets) {
          // Kiểm tra xem đã có ticket nào đang đặt ghế này cho showtime này chưa
          const existingTicket = await Ticket.findOne({
            where: {
              showtimeId: t.showtimeId,
              seatId: t.seatId,
              isReserved: true, // Chỉ check những ticket đang được đặt
            },
          });

          const key = `${t.showtimeId}:${t.seatId}`;

          if (existingTicket) {
            throw new Error(
              `Seat ${t.seatId} already reserved for showtime ${t.showtimeId}`
            );
          }

          if (pending.has(key)) {
            throw new Error(
              `Duplicate seat ${t.seatId} for showtime ${t.showtimeId} in request`
            );
          }
          pending.add(key);
        }
      }

      // Tính thời gian hết hạn (5 phút kể từ bây giờ)
      const reservationExpiresAt = new Date();
      reservationExpiresAt.setMinutes(reservationExpiresAt.getMinutes() + 5);

      // Tạo order với thời gian hết hạn
      const newOrder = await Order.create(
        {
          ...orderData,
          status: "pending",
          reservationExpiresAt,
        },
        { transaction }
      );

      // Tạo orderProductDetails
      if (products && Array.isArray(products)) {
        for (const prod of products) {
          await OrderProductDetails.create(
            {
              orderId: newOrder.id,
              productId: prod.productId,
              quantity: prod.quantity,
            },
            { transaction }
          );
        }
      }

      // Tạo tickets với thời gian giữ chỗ
      if (tickets && Array.isArray(tickets)) {
        const ticketReservedUntil = new Date();
        ticketReservedUntil.setMinutes(ticketReservedUntil.getMinutes() + 5);

        for (const t of tickets) {
          await Ticket.create(
            {
              orderId: newOrder.id,
              showtimeId: t.showtimeId,
              seatId: t.seatId,
              reservedUntil: ticketReservedUntil,
              isReserved: true, // Đánh dấu ticket là đã được đặt
            },
            { transaction }
          );
        }
      }

      await transaction?.commit();

      return newOrder;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  /**
   * Gửi email xác nhận đơn hàng (chỉ gửi khi thanh toán thành công)
   */
  static async sendOrderConfirmationEmail(orderId: number): Promise<void> {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      // Chỉ gửi email khi order đã hoàn thành (thanh toán thành công)
      if (order.status !== "completed") {
        console.log(`Order ${orderId} is not completed. Skipping email.`);
        return;
      }

      const user = await User.findByPk(order.userId);
      if (!user || !user.email) {
        console.log("User or user email not found");
        return;
      }

      // Lấy danh sách tickets
      const tickets = await Ticket.findAll({ where: { orderId: order.id } });
      if (!tickets || tickets.length === 0) {
        console.log("No tickets found for order");
        return;
      }

      // Lấy thông tin showtime (giả sử tất cả tickets cùng showtime)
      const showtimeId = tickets[0]?.showtimeId;
      const showtime = showtimeId ? await Showtime.findByPk(showtimeId) : null;

      // Lấy thông tin movie, room, cinema
      let movie = null as any;
      let room = null as any;
      let cinema = null as any;
      if (showtime) {
        if (showtime.movieId) {
          movie = await Movie.findByPk(showtime.movieId, {
            attributes: ["title"],
          });
        }
        if (showtime.roomId) {
          room = await Room.findByPk(showtime.roomId, {
            attributes: ["name", "cinemaId"],
          });
          if (room && room.cinemaId) {
            cinema = await Cinema.findByPk(room.cinemaId, {
              attributes: ["name", "address"],
            });
          }
        }
      }

      // Lấy danh sách vé với thông tin ghế
      const ticketDetails: Array<any> = [];
      for (const ticket of tickets) {
        const seat = await Seat.findByPk(ticket.seatId, {
          attributes: ["seatNumber"],
        });
        ticketDetails.push({
          seat: seat?.seatNumber || "Unknown",
          price: showtime?.price || 0,
        });
      }

      // Lấy danh sách sản phẩm
      const productDetails: Array<any> = [];
      const orderProducts = await OrderProductDetails.findAll({
        where: { orderId: order.id },
      });
      for (const orderProd of orderProducts) {
        const product = await Product.findByPk(orderProd.productId, {
          attributes: ["name", "price"],
        });
        if (product) {
          productDetails.push({
            name: product.name,
            quantity: orderProd.quantity,
            price: product.price,
          });
        }
      }

      // Chuẩn bị dữ liệu email
      const orderDetails = {
        customerName: user.fullName || user.email || "Khách hàng",
        movieTitle: movie?.title || "Unknown",
        cinemaName: cinema?.name || "Unknown",
        cinemaAddress: cinema?.address || "Unknown",
        roomName: room?.name || "Unknown",
        ticketPrice: showtime?.price || 0,
        showtime: showtime
          ? new Date(showtime.showTime).toLocaleString("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "Unknown",
        tickets: ticketDetails,
        products: productDetails,
        totalPrice: order.totalPrice,
      };

      await EmailService.sendBookingConfirmation(user.email, orderDetails);
      console.log(`Confirmation email sent for order ${orderId}`);
    } catch (error) {
      console.error(
        `Failed to send confirmation email for order ${orderId}:`,
        error
      );
      // Không throw error để không làm fail quá trình thanh toán
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
      // Xóa tickets (không cần giải phóng ghế riêng vì isReserved nằm trong ticket)
      await Ticket.destroy({ where: { orderId: order_id }, transaction });
      await OrderProductDetails.destroy({
        where: { orderId: order_id },
        transaction,
      });
      await order.destroy({ transaction });
      await transaction?.commit();
      return true;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  /**
   * Hủy vé của người dùng
   * Chỉ cho phép hủy nếu order đang ở trạng thái pending hoặc completed
   * và thời gian chiếu phim chưa diễn ra
   */
  static async cancelOrder(orderId: number, userId: number) {
    const transaction = (await Order.sequelize?.transaction()) ?? null;

    try {
      // Tìm order và kiểm tra quyền sở hữu
      const order = await Order.findByPk(orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      // Kiểm tra order có thuộc về user này không
      if (order.userId !== userId) {
        throw new Error("Unauthorized: You can only cancel your own orders");
      }

      // Kiểm tra trạng thái order
      if (order.status === "cancelled") {
        throw new Error("Order has already been cancelled");
      }

      if (order.status === "failed") {
        throw new Error("Cannot cancel a failed order");
      }

      // Lấy thông tin tickets và showtime để kiểm tra thời gian chiếu
      const tickets = await Ticket.findAll({
        where: { orderId: order.id },
        include: [
          {
            model: Showtime,
            as: "showtime",
            attributes: ["showTime"],
          },
        ],
      });

      if (tickets.length > 0) {
        const firstTicket = tickets[0] as any;
        const showtime = firstTicket.showtime;

        if (showtime && showtime.showTime) {
          const showtimeDate = new Date(showtime.showTime);
          const now = new Date();

          // Không cho phép hủy nếu phim đã chiếu hoặc sắp chiếu (ví dụ: trong vòng 30 phút)
          const thirtyMinutesBeforeShow = new Date(
            showtimeDate.getTime() - 30 * 60 * 1000
          );

          if (now >= thirtyMinutesBeforeShow) {
            throw new Error(
              "Cannot cancel order: showtime has started or is about to start"
            );
          }
        }
      }

      // Cập nhật trạng thái order thành cancelled
      await order.update(
        {
          status: "cancelled",
          reservationExpiresAt: null,
        },
        { transaction }
      );

      // Giải phóng ghế - cập nhật isReserved = false và xóa reservedUntil
      await Ticket.update(
        {
          isReserved: false,
          reservedUntil: null,
        },
        {
          where: { orderId: order.id },
          transaction,
        }
      );

      await transaction?.commit();

      return {
        success: true,
        message: "Order cancelled successfully",
        orderId: order.id,
      };
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }
}
