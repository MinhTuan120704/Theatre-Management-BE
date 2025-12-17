import { Router } from "express";
import ProductController from "../controllers/product.controller";
import {
  authenticate,
  requirePermission,
} from "../middlewares/auth.middleware";
import { ResourcePermissions } from "../config/permissions";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of all products
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *               price:
 *                 type: number
 *                 description: Product price
 *               category:
 *                 type: string
 *                 enum: [food, drink]
 *                 description: Product category
 *               image:
 *                 type: string
 *                 description: Product image URL
 *           example:
 *             name: "Popcorn"
 *             price: 50
 *             category: "food"
 *             image: "https://example.com/popcorn.jpg"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 */
router.get("/", ProductController.getAll);
router.post(
  "/",
  authenticate,
  requirePermission(ResourcePermissions.products.create),
  ProductController.create
);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 *   patch:
 *     summary: Update a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *               price:
 *                 type: number
 *                 description: Product price
 *               category:
 *                 type: string
 *                 enum: [food, drink]
 *                 description: Product category
 *               image:
 *                 type: string
 *                 description: Product image URL
 *           example:
 *             price: 60
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.get("/:id", ProductController.getById);
router.patch(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.products.update),
  ProductController.update
);
router.delete(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.products.delete),
  ProductController.delete
);

export default router;
