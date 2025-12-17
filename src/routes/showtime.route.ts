import { Router } from "express";
import ShowTimeController from "../controllers/showtime.controller";
import {
  authenticate,
  requirePermission,
} from "../middlewares/auth.middleware";
import { ResourcePermissions } from "../config/permissions";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Showtime
 *   description: API endpoints for managing showtimes
 */

/**
 * @swagger
 * /api/showtimes:
 *   get:
 *     summary: Get all showtimes
 *     tags: [Showtime]
 *     responses:
 *       200:
 *         description: List of all showtimes
 *   post:
 *     summary: Create a new showtime
 *     tags: [Showtime]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: integer
 *                 description: ID of the room
 *               movieId:
 *                 type: integer
 *                 description: ID of the movie
 *               showTime:
 *                 type: string
 *                 format: date-time
 *                 description: Showtime date and time
 *               price:
 *                 type: number
 *                 description: Ticket price
 *           example:
 *             roomId: 1
 *             movieId: 2
 *             showTime: "2025-12-13T19:00:00Z"
 *             price: 100
 *     responses:
 *       201:
 *         description: Showtime created successfully
 *       400:
 *         description: Invalid input
 */
router.get("/", ShowTimeController.getAll);
router.post(
  "/",
  authenticate,
  requirePermission(ResourcePermissions.showtimes.create),
  ShowTimeController.create
);

/**
 * @swagger
 * /api/showtimes/{id}:
 *   get:
 *     summary: Get a showtime by ID
 *     tags: [Showtime]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: Showtime found
 *       404:
 *         description: Showtime not found
 *   patch:
 *     summary: Update a showtime by ID
 *     tags: [Showtime]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Showtime ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: integer
 *                 description: ID of the room
 *               movieId:
 *                 type: integer
 *                 description: ID of the movie
 *               showTime:
 *                 type: string
 *                 format: date-time
 *                 description: Showtime date and time
 *               price:
 *                 type: number
 *                 description: Ticket price
 *           example:
 *             price: 120
 *     responses:
 *       200:
 *         description: Showtime updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Showtime not found
 *   delete:
 *     summary: Delete a showtime by ID
 *     tags: [Showtime]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: Showtime deleted successfully
 *       404:
 *         description: Showtime not found
 */
router.get("/:id", ShowTimeController.getById);
router.patch(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.showtimes.update),
  ShowTimeController.update
);
router.delete(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.showtimes.delete),
  ShowTimeController.delete
);

export default router;
