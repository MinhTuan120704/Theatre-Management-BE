import { Router } from "express";
import DiscountController from "../controllers/discount.controller";
import {
  authenticate,
  requirePermission,
} from "../middlewares/auth.middleware";
import { ResourcePermissions } from "../config/permissions";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Discount
 *   description: API endpoints for managing discounts
 */

/**
 * @swagger
 * /api/discounts:
 *   get:
 *     summary: Get all discounts
 *     tags: [Discount]
 *     responses:
 *       200:
 *         description: List of all discounts
 *   post:
 *     summary: Create a new discount
 *     tags: [Discount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Discount code
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 description: Type of discount
 *               value:
 *                 type: number
 *                 description: Discount value
 *               maxUsage:
 *                 type: integer
 *                 description: Maximum usage count
 *               minPurchase:
 *                 type: number
 *                 description: Minimum purchase amount
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 description: Expiry date
 *           example:
 *             code: "SUMMER2025"
 *             discountType: "percentage"
 *             value: 10
 *             maxUsage: 100
 *             minPurchase: 200
 *             expiryDate: "2025-12-31T23:59:59Z"
 *     responses:
 *       201:
 *         description: Discount created successfully
 *       400:
 *         description: Invalid input
 */
router.get("/", DiscountController.getAll);
router.post(
  "/",
  authenticate,
  requirePermission(ResourcePermissions.discounts.create),
  DiscountController.create
);

/**
 * @swagger
 * /api/discounts/{id}:
 *   get:
 *     summary: Get a discount by ID
 *     tags: [Discount]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Discount ID
 *     responses:
 *       200:
 *         description: Discount found
 *       404:
 *         description: Discount not found
 *   patch:
 *     summary: Update a discount by ID
 *     tags: [Discount]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Discount ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Discount code
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 description: Type of discount
 *               value:
 *                 type: number
 *                 description: Discount value
 *               maxUsage:
 *                 type: integer
 *                 description: Maximum usage count
 *               minPurchase:
 *                 type: number
 *                 description: Minimum purchase amount
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 description: Expiry date
 *           example:
 *             value: 15
 *             expiryDate: "2026-01-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Discount not found
 *   delete:
 *     summary: Delete a discount by ID
 *     tags: [Discount]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Discount ID
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *       404:
 *         description: Discount not found
 */
router.get("/:id", DiscountController.getById);
router.patch(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.discounts.update),
  DiscountController.update
);
router.delete(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.discounts.delete),
  DiscountController.delete
);

export default router;
