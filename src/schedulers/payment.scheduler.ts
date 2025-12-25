import { PaymentService } from "../services/payment.service";

/**
 * Scheduler để tự động hủy các order đã hết hạn
 * Chạy mỗi 1 phút
 */
export class PaymentScheduler {
  private static intervalId: NodeJS.Timeout | null = null;

  /**
   * Khởi động scheduler
   */
  static start(): void {
    if (this.intervalId) {
      console.log("Payment scheduler is already running");
      return;
    }

    console.log("Starting payment scheduler...");

    // Chạy ngay lập tức khi khởi động
    this.runCleanup();

    // Sau đó chạy mỗi 1 giờ
    this.intervalId = setInterval(() => {
      this.runCleanup();
    }, 60 * 60 * 1000); // 60 minutes

    console.log("Payment scheduler started successfully");
  }

  /**
   * Dừng scheduler
   */
  static stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Payment scheduler stopped");
    }
  }

  /**
   * Chạy cleanup
   */
  private static async runCleanup(): Promise<void> {
    try {
      const cancelledCount = await PaymentService.cleanupExpiredReservations();
      if (cancelledCount > 0) {
        console.log(
          `[${new Date().toISOString()}] Cancelled ${cancelledCount} expired order(s)`
        );
      }
    } catch (error) {
      console.error("Error running payment scheduler cleanup:", error);
    }
  }
}
