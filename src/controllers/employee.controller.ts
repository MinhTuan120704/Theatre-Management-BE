import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';

export default class EmployeeController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const offset = limit ? (page - 1) * limit : undefined;
      const result = await EmployeeService.getAll(limit, offset);
      const { employees, total } = result;
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: total
      };
      res.json({ employees, pagination });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch employees' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const employee = await EmployeeService.getById(Number(req.params.id));
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch employee' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newEmployee = await EmployeeService.create(req.body);
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create employee' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedEmployee = await EmployeeService.update(Number(req.params.id), req.body);
      if (!updatedEmployee) return res.status(404).json({ error: 'Employee not found' });
      res.json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update employee' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await EmployeeService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Employee not found' });
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete employee' });
    }
  }
}
