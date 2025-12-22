import { Router } from "express";
import ShowTimeController from "../controllers/showtime.controller";
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
 *   name: Showtime
 *   description: API endpoints for managing showtimes
 */

/**
 * @swagger
 * /api/showtimes:
 *   get:
 *     summary: Get all showtimes
 *     tags: [Showtime]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of showtimes to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of showtimes with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 showtimes:
 *                   type: array
 *                   items:
 *                     $ref: 'src/models/dto/showtime/showtime-response.dto.ts'
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
router.get("/", readOperationLimiter, ShowTimeController.getAll);
router.post(
  "/",
  writeOperationLimiter,
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
router.get("/:id", readOperationLimiter, ShowTimeController.getById);
router.patch(
  "/:id",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.showtimes.update),
  ShowTimeController.update
);
router.delete(
  "/:id",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.showtimes.delete),
  ShowTimeController.delete
);

/**
 * @swagger
 * /api/showtimes/searchByMovieId/{movieId}:
 *   get:
 *     summary: Get showtimes by movie ID for the next 3 days
 *     tags: [Showtime]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: List of showtimes for the movie in the next 3 days
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 showtimes:
 *                   type: array
 *                   items:
 *                     $ref: 'src/models/dto/showtime/showtime-response.dto.ts'
 *       404:
 *         description: No showtimes found for the movie
 */

/**
 * @swagger
 * /api/showtimes/cinema/{cinemaId}/movie/{movieId}/date/{date}:
 *   get:
 *     summary: Get showtimes by cinema, movie, and date
 *     tags: [Showtime]
 *     parameters:
 *       - in: path
 *         name: cinemaId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Cinema ID
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Movie ID
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: List of showtimes for the specified cinema, movie, and date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 showtimes:
 *                   type: array
 *                   items:
 *                     $ref: 'src/models/dto/showtime/showtime-response.dto.ts'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/searchByMovieId/:movieId",
  readOperationLimiter,
  ShowTimeController.searchShowtimebyMovieId
);
router.get(
  "/cinema/:cinemaId/movie/:movieId/date/:date",
  readOperationLimiter,
  ShowTimeController.getShowtimesByCinemaMovieDate
);

export default router;
