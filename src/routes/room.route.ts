
import { Router } from "express";
import RoomController from "../controllers/room.controller";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Room
 *   description: API endpoints for managing rooms
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Room]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of rooms to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of rooms with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rooms:
 *                   type: array
 *                   items:
 *                     $ref: 'src/models/dto/room/room-response.dto.ts'
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
 *     summary: Create a new room
 *     tags: [Room]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cinemaId:
 *                 type: integer
 *                 description: ID of the cinema
 *               name:
 *                 type: string
 *                 description: Name of the room
 *               capacity:
 *                 type: integer
 *                 description: Capacity of the room
 *               seats:
 *                 type: array
 *                 description: Optional list of seats to create with the room
 *                 items:
 *                   type: object
 *                   properties:
 *                     seat_name:
 *                       type: string
 *                     seat_column:
 *                       type: string
 *           example:
 *             cinemaId: 1
 *             name: "Room A"
 *             capacity: 50
 *             seats: [{ seatNumber: "A01" }, { seatNumber: "A02" }]
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Invalid input
 */
router.get("/", RoomController.getAll);
router.post("/", RoomController.create);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get a room by ID
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room found
 *       404:
 *         description: Room not found
 *   patch:
 *     summary: Update a room by ID
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cinemaId:
 *                 type: integer
 *                 description: ID of the cinema
 *               name:
 *                 type: string
 *                 description: Name of the room
 *               capacity:
 *                 type: integer
 *                 description: Capacity of the room
 *           example:
 *             name: "Room B"
 *             capacity: 60
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Room not found
 *   delete:
 *     summary: Delete a room by ID
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 */
router.get("/:id", RoomController.getById);
router.patch("/:id", RoomController.update);
router.delete("/:id", RoomController.delete);

export default router;
