import { Router } from "express";
import OrderController from "../controllers/order.controller";
import {
  authenticate,
  requirePermission,
  requireAnyPermission,
} from "../middlewares/auth.middleware";
import { ResourcePermissions } from "../config/permissions";
import {
  readOperationLimiter,
  writeOperationLimiter,
} from "../middlewares/rateLimiter.middleware";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of orders to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of orders with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: 'src/models/dto/order/order-response.dto.ts'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *                     totalItems:
 *                       type: integer
 *                       description: Total number of items
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *               totalPrice:
 *                 type: number
 *                 description: Total price of the order
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, paypal, cash]
 *                 description: Payment method
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed, cancelled]
 *                 description: Order status
 *               paidAt:
 *                 type: string
 *                 format: date-time
 *                 description: Payment date
 *               discountId:
 *                 type: integer
 *                 description: Discount ID
 *               orderedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Order date
 *               tickets:
 *                 type: array
 *                 description: List of tickets
 *                 items:
 *                   type: object
 *                   properties:
 *                     showtimeId:
 *                       type: integer
 *                     seatId:
 *                       type: integer
 *               products:
 *                 type: array
 *                 description: List of products
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *           example:
 *             userId: 1
 *             totalPrice: 500
 *             paymentMethod: "credit_card"
 *             status: "pending"
 *             tickets: [{ showtimeId: 1, seatId: 2 }]
 *             products: [{ productId: 1, quantity: 2 }]
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 */
router.get(
  "/",
  readOperationLimiter,
  authenticate,
  requireAnyPermission(
    ResourcePermissions.orders.read,
    ResourcePermissions.orders.readOwn
  ),
  OrderController.getAll
);
router.post(
  "/",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.orders.create),
  OrderController.create
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 *   patch:
 *     summary: Update an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *               totalPrice:
 *                 type: number
 *                 description: Total price of the order
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, paypal, cash]
 *                 description: Payment method
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed, cancelled]
 *                 description: Order status
 *               paidAt:
 *                 type: string
 *                 format: date-time
 *                 description: Payment date
 *               discountId:
 *                 type: integer
 *                 description: Discount ID
 *               orderedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Order date
 *           example:
 *             status: "completed"
 *             paidAt: "2025-12-13T12:00:00Z"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.get(
  "/:id",
  readOperationLimiter,
  authenticate,
  requireAnyPermission(
    ResourcePermissions.orders.read,
    ResourcePermissions.orders.readOwn
  ),
  OrderController.getById
);
router.patch(
  "/:id",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.orders.update),
  OrderController.update
);
router.delete(
  "/:id",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.orders.delete),
  OrderController.delete
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   post:
 *     summary: Cancel an order (user can only cancel their own orders)
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID to cancel
 *     responses:
 *       200:
 *         description: Order cancelled successfully
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
 *                   type: integer
 *       400:
 *         description: Cannot cancel order (already cancelled, showtime has started, etc.)
 *       403:
 *         description: Unauthorized - can only cancel your own orders
 *       404:
 *         description: Order not found
 */
router.post(
  "/:id/cancel",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.orders.cancel),
  OrderController.cancelOrder
);

/**
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Get all orders by user ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of orders for the user
 *       404:
 *         description: No orders found for the user
 */
router.get(
  "/user/:userId",
  readOperationLimiter,
  authenticate,
  requireAnyPermission(
    ResourcePermissions.orders.read,
    ResourcePermissions.orders.readOwn
  ),
  OrderController.getOrderByUserId
);

export default router;
