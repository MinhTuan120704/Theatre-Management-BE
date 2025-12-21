import { Router } from "express";
import MovieController from "../controllers/movie.controller";
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
 *   name: Movie
 *   description: API endpoints for managing movies
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movie]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of movies to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of movies with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: 'src/models/dto/movie/movie-response.dto.ts'
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
 *     summary: Create a new movie
 *     tags: [Movie]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Movie title
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of genres
 *               description:
 *                 type: string
 *                 description: Movie description
 *               director:
 *                 type: string
 *                 description: Director name
 *               actors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of actors
 *               country:
 *                 type: string
 *                 description: Country of origin
 *               durationMinutes:
 *                 type: integer
 *                 description: Duration in minutes
 *               releaseDate:
 *                 type: string
 *                 format: date-time
 *                 description: Release date
 *               posterUrl:
 *                 type: string
 *                 description: Poster image URL
 *               trailerUrl:
 *                 type: string
 *                 description: Trailer video URL
 *           example:
 *             title: "Avengers: Endgame"
 *             genres: ["Action", "Adventure"]
 *             description: "Superheroes unite to save the universe."
 *             director: "Anthony Russo, Joe Russo"
 *             actors: ["Robert Downey Jr.", "Chris Evans"]
 *             country: "USA"
 *             durationMinutes: 181
 *             releaseDate: "2019-04-26T00:00:00Z"
 *             posterUrl: "https://example.com/poster.jpg"
 *             trailerUrl: "https://example.com/trailer.mp4"
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Invalid input
 */
router.get("/", readOperationLimiter, MovieController.getAll);
router.post(
  "/",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.movies.create),
  MovieController.create
);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie found
 *       404:
 *         description: Movie not found
 *   patch:
 *     summary: Update a movie by ID
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Movie title
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of genres
 *               description:
 *                 type: string
 *                 description: Movie description
 *               director:
 *                 type: string
 *                 description: Director name
 *               actors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of actors
 *               country:
 *                 type: string
 *                 description: Country of origin
 *               durationMinutes:
 *                 type: integer
 *                 description: Duration in minutes
 *               releaseDate:
 *                 type: string
 *                 format: date-time
 *                 description: Release date
 *               posterUrl:
 *                 type: string
 *                 description: Poster image URL
 *               trailerUrl:
 *                 type: string
 *                 description: Trailer video URL
 *           example:
 *             title: "Avengers: Endgame (Updated)"
 *             durationMinutes: 182
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Movie not found
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 */
router.get("/:id", readOperationLimiter, MovieController.getById);
router.patch(
  "/:id",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.movies.update),
  MovieController.update
);
router.delete(
  "/:id",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.movies.delete),
  MovieController.delete
);

export default router;
