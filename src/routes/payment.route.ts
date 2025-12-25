import { Router } from "express";
import PaymentController from "../controllers/payment.controller";
import {
  authenticate,
  requirePermission,
} from "../middlewares/auth.middleware";
import { ResourcePermissions } from "../config/permissions";
import { writeOperationLimiter } from "../middlewares/rateLimiter.middleware";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: API endpoints for payment processing
 */

/**
 * @swagger
 * /api/payments/{orderId}/process:
 *   post:
 *     summary: Process payment for an order
 *     description: Process payment for an order. Use isSuccess to control payment result (for testing purposes).
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID to process payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, paypal, cash]
 *                 description: Payment method to use
 *                 example: credit_card
 *               isSuccess:
 *                 type: boolean
 *                 description: Control payment result (true = success, false = fail). Default is true.
 *                 example: true
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 orderId:
 *                   type: number
 *       400:
 *         description: Payment failed or invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/:orderId/process",
  authenticate,
  writeOperationLimiter,
  PaymentController.processPayment
);

/**
 * @swagger
 * /api/payments/{orderId}/status:
 *   get:
 *     summary: Check payment status and time remaining
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID to check status
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, failed, cancelled]
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 timeRemaining:
 *                   type: integer
 *                   nullable: true
 *                   description: Seconds remaining until expiration
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/:orderId/status",
  authenticate,
  PaymentController.checkPaymentStatus
);

/**
 * @swagger
 * /api/payments/cleanup:
 *   post:
 *     summary: Manually trigger cleanup of expired reservations (Admin only)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cleanup completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cancelledOrders:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post(
  "/cleanup",
  authenticate,
  requirePermission(ResourcePermissions.orders.delete),
  writeOperationLimiter,
  PaymentController.cleanupExpiredReservations
);

export default router;
