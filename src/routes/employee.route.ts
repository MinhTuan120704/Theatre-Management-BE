import { Router } from "express";
import EmployeeController from "../controllers/employee.controller";
import {
  authenticate,
  requirePermission,
} from "../middlewares/auth.middleware";
import { ResourcePermissions } from "../config/permissions";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: API endpoints for managing employees
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employee]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of employees to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of employees with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employees:
 *                   type: array
 *                   items:
 *                     $ref: 'src/models/dto/employee/employee-response.dto.ts'
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
 *     summary: Create a new employee
 *     tags: [Employee]
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
 *               position:
 *                 type: string
 *                 description: Position of the employee
 *               shift:
 *                 type: string
 *                 description: Shift of the employee
 *           example:
 *             cinemaId: 1
 *             position: "Manager"
 *             shift: "Morning"
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Invalid input
 */
router.get(
  "/",
  authenticate,
  requirePermission(ResourcePermissions.employees.read),
  EmployeeController.getAll
);
router.post(
  "/",
  authenticate,
  requirePermission(ResourcePermissions.employees.create),
  EmployeeController.create
);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get an employee by ID
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee found
 *       404:
 *         description: Employee not found
 *   patch:
 *     summary: Update an employee by ID
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
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
 *               position:
 *                 type: string
 *                 description: Position of the employee
 *               shift:
 *                 type: string
 *                 description: Shift of the employee
 *           example:
 *             position: "Cashier"
 *             shift: "Evening"
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Employee not found
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
router.get(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.employees.read),
  EmployeeController.getById
);
router.patch(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.employees.update),
  EmployeeController.update
);
router.delete(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.employees.delete),
  EmployeeController.delete
);

export default router;
