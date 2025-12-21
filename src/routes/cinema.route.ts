import { Router } from "express";
import CinemaController from "../controllers/cinema.controller";
import {
  authenticate,
  requirePermission,
} from "../middlewares/auth.middleware";
import { ResourcePermissions } from "../config/permissions";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Cinema
 *   description: API endpoints for managing cinemas
 */

/**
 * @swagger
 * /api/cinemas:
 *   get:
 *     summary: Get all cinemas
 *     tags: [Cinema]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of cinemas to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of cinemas with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cinemas:
 *                   type: array
 *                   items:
 *                     $ref: 'src/models/dto/cinema/cinema-response.dto.ts'
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
 *     summary: Create a new cinema
 *     tags: [Cinema]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the cinema
 *               address:
 *                 type: string
 *                 description: Address of the cinema
 *           example:
 *             name: "Galaxy Cinema"
 *             address: "123 Main St, City"
 *     responses:
 *       201:
 *         description: Cinema created successfully
 *       400:
 *         description: Invalid input
 */
router.get("/", CinemaController.getAll);
router.post(
  "/",
  authenticate,
  requirePermission(ResourcePermissions.cinemas.create),
  CinemaController.create
);

/**
 * @swagger
 * /api/cinemas/{id}:
 *   get:
 *     summary: Get a cinema by ID
 *     tags: [Cinema]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Cinema ID
 *     responses:
 *       200:
 *         description: Cinema found
 *       404:
 *         description: Cinema not found
 *   patch:
 *     summary: Update a cinema by ID
 *     tags: [Cinema]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Cinema ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the cinema
 *               address:
 *                 type: string
 *                 description: Address of the cinema
 *           example:
 *             name: "CGV Cinema"
 *             address: "456 Another St, City"
 *     responses:
 *       200:
 *         description: Cinema updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Cinema not found
 *   delete:
 *     summary: Delete a cinema by ID
 *     tags: [Cinema]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Cinema ID
 *     responses:
 *       200:
 *         description: Cinema deleted successfully
 *       404:
 *         description: Cinema not found
 */
router.get("/:id", CinemaController.getById);
router.patch(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.cinemas.update),
  CinemaController.update
);
router.delete(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.cinemas.delete),
  CinemaController.delete
);

export default router;
