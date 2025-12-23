import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";

export default class PaymentController {
  /**
   * Xác nhận thanh toán cho order
   */
  static async processPayment(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId);
      const { paymentMethod } = req.body;

      if (!paymentMethod) {
        return res.status(400).json({ error: "Payment method is required" });
      }

      const result = await PaymentService.processPayment(
        orderId,
        paymentMethod
      );

      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          orderId,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to process payment",
        message: error.message,
      });
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán
   */
  static async checkPaymentStatus(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId);
      const status = await PaymentService.checkPaymentStatus(orderId);
      res.json(status);
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to check payment status",
        message: error.message,
      });
    }
  }

  /**
   * Chạy cleanup expired reservations (dùng cho admin hoặc cron job)
   */
  static async cleanupExpiredReservations(req: Request, res: Response) {
    try {
      const cancelledCount = await PaymentService.cleanupExpiredReservations();
      res.json({
        message: "Cleanup completed",
        cancelledOrders: cancelledCount,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to cleanup expired reservations",
        message: error.message,
      });
    }
  }
}
