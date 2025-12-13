
import { Router } from "express";
import SeatController from "../controllers/seat.controller";

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
 *     responses:
 *       200:
 *         description: List of all seats
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
router.get("/", SeatController.getAll);
router.post("/", SeatController.create);

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
router.get("/:id", SeatController.getById);
router.patch("/:id", SeatController.update);
router.delete("/:id", SeatController.delete);

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
router.get('/room/:roomId', SeatController.getByRoomId);

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
router.get('/showtime/:showtimeId', SeatController.getByShowtimeId);

export default router;
