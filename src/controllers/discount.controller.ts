import { Request, Response } from 'express';
import { DiscountService } from '../services/discount.service';

export default class DiscountController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const offset = limit ? (page - 1) * limit : undefined;
      const result = await DiscountService.getAll(limit, offset);
      const { discounts, total } = result;
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: total
      };
      res.json({ discounts, pagination });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch discounts' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const discount = await DiscountService.getById(Number(req.params.id));
      if (!discount) return res.status(404).json({ error: 'Discount not found' });
      res.json(discount);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch discount' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newDiscount = await DiscountService.create(req.body);
      res.status(201).json(newDiscount);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create discount' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedDiscount = await DiscountService.update(Number(req.params.id), req.body);
      if (!updatedDiscount) return res.status(404).json({ error: 'Discount not found' });
      res.json(updatedDiscount);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update discount' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await DiscountService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Discount not found' });
      res.json({ message: 'Discount deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete discount' });
    }
  }
}
