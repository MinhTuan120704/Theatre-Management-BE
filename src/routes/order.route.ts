import { Router } from "express";
import OrderController from "../controllers/order.controller";
import {
  authenticate,
  requirePermission,
  requireAnyPermission,
} from "../middlewares/auth.middleware";
import { ResourcePermissions } from "../config/permissions";

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
 *     responses:
 *       200:
 *         description: List of all orders
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
 *             orderedAt: "2025-12-13T10:00:00Z"
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
  authenticate,
  requireAnyPermission(
    ResourcePermissions.orders.read,
    ResourcePermissions.orders.readOwn
  ),
  OrderController.getAll
);
router.post(
  "/",
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
  authenticate,
  requireAnyPermission(
    ResourcePermissions.orders.read,
    ResourcePermissions.orders.readOwn
  ),
  OrderController.getById
);
router.patch(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.orders.update),
  OrderController.update
);
router.delete(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.orders.delete),
  OrderController.delete
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
  authenticate,
  requireAnyPermission(
    ResourcePermissions.orders.read,
    ResourcePermissions.orders.readOwn
  ),
  OrderController.getOrderByUserId
);

export default router;
