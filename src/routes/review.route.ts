
import { Router } from "express";
import ReviewController from "../controllers/review.controller";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: API endpoints for managing reviews
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Review]
 *     responses:
 *       200:
 *         description: List of all reviews
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *               movieId:
 *                 type: integer
 *                 description: ID of the movie
 *               rating:
 *                 type: number
 *                 description: Rating score
 *               comment:
 *                 type: string
 *                 description: Review comment
 *           example:
 *             userId: 1
 *             movieId: 2
 *             rating: 5
 *             comment: "Great movie!"
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid input
 */
router.get("/", ReviewController.getAll);
router.post("/", ReviewController.create);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review found
 *       404:
 *         description: Review not found
 *   patch:
 *     summary: Update a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *               movieId:
 *                 type: integer
 *                 description: ID of the movie
 *               rating:
 *                 type: number
 *                 description: Rating score
 *               comment:
 *                 type: string
 *                 description: Review comment
 *           example:
 *             rating: 4
 *             comment: "Good movie."
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.get("/:id", ReviewController.getById);
router.patch("/:id", ReviewController.update);
router.delete("/:id", ReviewController.delete);

export default router;
