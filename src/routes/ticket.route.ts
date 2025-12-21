import { Router } from "express";
import TicketController from "../controllers/ticket.controller";
import {
  authenticate,
  requirePermission,
  requireAnyPermission,
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
 *   name: Ticket
 *   description: API endpoints for managing tickets
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Ticket]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of tickets to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of tickets with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tickets:
 *                   type: array
 *                   items:
 *                     $ref: 'src/models/dto/ticket/ticket-response.dto.ts'
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
 *     summary: Create a new ticket
 *     tags: [Ticket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: 'src/models/dto/ticket/ticket-create.dto.ts'
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Invalid input
 */

router.get(
  "/",
  readOperationLimiter,
  authenticate,
  requireAnyPermission(
    ResourcePermissions.tickets.read,
    ResourcePermissions.tickets.readOwn
  ),
  TicketController.getAll
);
router.post(
  "/",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.tickets.create),
  TicketController.create
);
router.get(
  "/:id",
  readOperationLimiter,
  authenticate,
  requireAnyPermission(
    ResourcePermissions.tickets.read,
    ResourcePermissions.tickets.readOwn
  ),
  TicketController.getById
);
router.patch(
  "/:id",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.tickets.update),
  TicketController.update
);
router.delete(
  "/:id",
  writeOperationLimiter,
  authenticate,
  requirePermission(ResourcePermissions.tickets.delete),
  TicketController.delete
);

export default router;
