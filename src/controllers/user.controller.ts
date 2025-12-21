import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export default class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const offset = limit ? (page - 1) * limit : undefined;
      const result = await UserService.getAll(limit, offset);
      const { users, total } = result;
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: total
      };
      res.json({ users, pagination });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const user = await UserService.getById(Number(req.params.id));
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newUser = await UserService.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedUser = await UserService.update(Number(req.params.id), req.body);
      if (!updatedUser) return res.status(404).json({ error: 'User not found' });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }

  static async getByEmail(req: Request, res: Response) {
    try {
      const email = req.params.email || '';
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const user = await UserService.getByEmail(email);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user by email' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await UserService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}
