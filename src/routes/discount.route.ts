
import { Router } from "express";
import DiscountController from "../controllers/discount.controller";

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
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of discounts to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of discounts with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 discounts:
 *                   type: array
 *                   items:
 *                     $ref: 'src/models/dto/discount/discount-response.dto.ts'
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
router.post("/", DiscountController.create);

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
router.patch("/:id", DiscountController.update);
router.delete("/:id", DiscountController.delete);

export default router;
