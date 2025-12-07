import { Request, Response } from 'express';
import { DiscountService } from '../services/discount.service';

export default class DiscountController {
  static async getAll(req: Request, res: Response) {
    try {
      const discounts = await DiscountService.getAll();
      res.json(discounts);
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
