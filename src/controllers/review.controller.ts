import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';

export default class ReviewController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const offset = limit ? (page - 1) * limit : undefined;
      const result = await ReviewService.getAll(limit, offset);
      const { reviews, total } = result;
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: total
      };
      res.json({ reviews, pagination });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const review = await ReviewService.getById(Number(req.params.id));
      if (!review) return res.status(404).json({ error: 'Review not found' });
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch review' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newReview = await ReviewService.create(req.body);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create review' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedReview = await ReviewService.update(Number(req.params.id), req.body);
      if (!updatedReview) return res.status(404).json({ error: 'Review not found' });
      res.json(updatedReview);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update review' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await ReviewService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Review not found' });
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete review' });
    }
  }
}
