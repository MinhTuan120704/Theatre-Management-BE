import { Router } from "express";
import SeatController from "../controllers/seat.controller";
import {
  authenticate,
  requirePermission,
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
 *   name: Seat
 *   description: API endpoints for managing seats
 */

/**
 * @swagger
 * /api/seats:
 *   get:
 *     summary: Get all seats
 *     tags: [Seat]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of seats to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of seats with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seats:
 *                   type: array
 *                   items:
 *                     $ref: 'src/models/dto/seat/seat-response.dto.ts'
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
 *     summary: Create a new seat
 *     tags: [Seat]
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
 *               seatNumber:
 *                 type: string
 *                 description: Seat number
 *               isReserved:
 *                 type: boolean
 *                 description: Is the seat reserved?
 *           example:
 *             roomId: 1
 *             seatNumber: "A1"
 *             isReserved: false
 *     responses:
 *       201:
 *         description: Seat created successfully
 *       400:
 *         description: Invalid input
 */
router.get("/", readOperationLimiter, SeatController.getAll);
router.post(
  "/",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.seats.create),
  SeatController.create
);

/**
 * @swagger
 * /api/seats/{id}:
 *   get:
 *     summary: Get a seat by ID
 *     tags: [Seat]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Seat ID
 *     responses:
 *       200:
 *         description: Seat found
 *       404:
 *         description: Seat not found
 *   patch:
 *     summary: Update a seat by ID
 *     tags: [Seat]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Seat ID
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
 *               seatNumber:
 *                 type: string
 *                 description: Seat number
 *               isReserved:
 *                 type: boolean
 *                 description: Is the seat reserved?
 *           example:
 *             isReserved: true
 *     responses:
 *       200:
 *         description: Seat updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Seat not found
 *   delete:
 *     summary: Delete a seat by ID
 *     tags: [Seat]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Seat ID
 *     responses:
 *       200:
 *         description: Seat deleted successfully
 *       404:
 *         description: Seat not found
 */
router.get("/:id", readOperationLimiter, SeatController.getById);
router.patch(
  "/:id",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.seats.update),
  SeatController.update
);
router.delete(
  "/:id",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.seats.delete),
  SeatController.delete
);

/**
 * @swagger
 * /api/seats/room/{roomId}:
 *   get:
 *     summary: Get all seats by room ID
 *     tags: [Seat]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Room ID
 *     responses:
 *       200:
 *         description: List of seats for the room
 *       404:
 *         description: No seats found for the room
 */
router.get("/room/:roomId", readOperationLimiter, SeatController.getByRoomId);

/**
 * @swagger
 * /api/seats/showtime/{showtimeId}:
 *   get:
 *     summary: Get all seats by showtime ID (with isReserved)
 *     tags: [Seat]
 *     parameters:
 *       - in: path
 *         name: showtimeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: List of seats for the showtime, with isReserved field
 *       404:
 *         description: No seats found for the showtime
 */
router.get(
  "/showtime/:showtimeId",
  readOperationLimiter,
  SeatController.getByShowtimeId
);

export default router;
