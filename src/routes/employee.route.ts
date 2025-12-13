
import { Router } from "express";
import EmployeeController from "../controllers/employee.controller";

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
 *     responses:
 *       200:
 *         description: List of all employees
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
router.get("/", EmployeeController.getAll);
router.post("/", EmployeeController.create);

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
router.get("/:id", EmployeeController.getById);
router.patch("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);

export default router;
