import Order from "../models/order.model";
import Ticket from "../models/ticket.model";
import Seat from "../models/seat.model";
import { Op } from "sequelize";
import { OrderService } from "./order.service";

export class PaymentService {
  /**
   * Giả lập thanh toán thành công hoặc thất bại
   * Trong thực tế, đây là nơi tích hợp với cổng thanh toán thực
   */
  static async processPayment(
    orderId: number,
    isSuccess: boolean
  ): Promise<{ success: boolean; message: string }> {
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Kiểm tra order đã hết hạn chưa
    if (order.reservationExpiresAt && new Date() > order.reservationExpiresAt) {
      await this.cancelExpiredOrder(orderId);
      throw new Error("Order reservation has expired");
    }

    // Kiểm tra trạng thái order
    if (order.status !== "pending") {
      throw new Error(`Order is not pending. Current status: ${order.status}`);
    }

    if (isSuccess) {
      // Thanh toán thành công
      await order.update({
        status: "completed",
        paidAt: new Date(),
        reservationExpiresAt: null, // Xóa thời gian hết hạn
      });

      // Xóa reservedUntil của các tickets
      await Ticket.update(
        { reservedUntil: null },
        { where: { orderId: order.id } }
      );

      return {
        success: true,
        message: "Payment successful",
      };
    } else {
      // Thanh toán thất bại
      await order.update({
        status: "failed",
        reservationExpiresAt: null,
      });

      await Ticket.update(
        { reservedUntil: null, isReserved: false },
        { where: { orderId: order.id } }
      );

      return {
        success: false,
        message: "Payment failed. Please try again.",
      };
    }
  }

  /**
   * Hủy order đã hết hạn - Update status thành cancelled
   */
  static async cancelExpiredOrder(orderId: number): Promise<void> {
    const transaction = (await Order.sequelize?.transaction()) ?? null;

    try {
      const order = await Order.findByPk(orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      // Cập nhật status order thành cancelled
      if (transaction) {
        await order.update(
          {
            status: "cancelled",
          },
          { transaction }
        );
      } else {
        await order.update({
          status: "cancelled",
        });
      }

      await transaction?.commit();
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  /**
   * Tự động hủy các order đã hết hạn và xóa các order cancelled
   * Hàm này sẽ được gọi định kỳ (ví dụ: mỗi phút)
   */
  static async cleanupExpiredReservations(): Promise<number> {
    const transaction = (await Order.sequelize?.transaction()) ?? null;
    let processedCount = 0;

    try {
      // 1. Tìm và update các order pending đã hết hạn thành cancelled
      const expiredOrders = await Order.findAll({
        where: {
          status: "pending",
          reservationExpiresAt: {
            [Op.lt]: new Date(), // Nhỏ hơn thời gian hiện tại
          },
        },
      });

      for (const order of expiredOrders) {
        try {
          await this.cancelExpiredOrder(order.id);
          processedCount++;
        } catch (error) {
          console.error(`Failed to cancel expired order ${order.id}:`, error);
        }
      }

      // 2. Tìm và xóa hoàn toàn các order có status cancelled
      const cancelledOrders = await Order.findAll({
        where: {
          status: "cancelled",
        },
      });

      for (const order of cancelledOrders) {
        try {
          // Xóa tickets trước
          if (transaction) {
            await Ticket.destroy({
              where: { orderId: order.id },
              transaction,
            });
          } else {
            await Ticket.destroy({
              where: { orderId: order.id },
            });
          }

          // Xóa order
          if (transaction) {
            await order.destroy({ transaction });
          } else {
            await order.destroy();
          }

          processedCount++;
        } catch (error) {
          console.error(`Failed to delete cancelled order ${order.id}:`, error);
        }
      }

      await transaction?.commit();
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }

    return processedCount;
  }

  /**
   * Kiểm tra trạng thái thanh toán của order
   */
  static async checkPaymentStatus(orderId: number): Promise<{
    status: string;
    expiresAt: Date | null;
    timeRemaining: number | null; // seconds
  }> {
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    let timeRemaining = null;
    if (order.reservationExpiresAt) {
      const now = new Date();
      const expiresAt = new Date(order.reservationExpiresAt);
      timeRemaining = Math.max(
        0,
        Math.floor((expiresAt.getTime() - now.getTime()) / 1000)
      );
    }

    return {
      status: order.status,
      expiresAt: order.reservationExpiresAt,
      timeRemaining,
    };
  }
}
