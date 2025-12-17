import { Router } from "express";
import UserController from "../controllers/user.controller";
import {
  authenticate,
  requirePermission,
  authorize,
} from "../middlewares/auth.middleware";
import { ResourcePermissions } from "../config/permissions";

const router: Router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
  "/",
  authenticate,
  requirePermission(ResourcePermissions.users.read),
  UserController.getAll
);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User information
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.users.read),
  UserController.getById
);
/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Get user by email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: User email
 *     responses:
 *       200:
 *         description: User information
 *       404:
 *         description: User not found
 */
router.get(
  "/email/:email",
  authenticate,
  requirePermission(ResourcePermissions.users.read),
  UserController.getByEmail
);
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyen Van A
 *               email:
 *                 type: string
 *                 example: nguyenvana@example.com
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               passwordHash:
 *                 type: string
 *                 example: your_password
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               identifyCode:
 *                 type: string
 *                 example: "123456789"
 *     responses:
 *       201:
 *         description: User created
 */
router.post(
  "/",
  authenticate,
  requirePermission(ResourcePermissions.users.create),
  UserController.create
);
/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyen Van A
 *               email:
 *                 type: string
 *                 example: nguyenvana@example.com
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               passwordHash:
 *                 type: string
 *                 example: your_hashed_password
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               identifyCode:
 *                 type: string
 *                 example: "123456789"
 *               role:
 *                 type: string
 *                 enum: [customer, admin, employee]
 *                 example: customer
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.users.update),
  UserController.update
);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.users.delete),
  UserController.delete
);

export default router;
