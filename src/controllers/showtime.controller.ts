import { Request, Response } from 'express';
import { ShowtimeService } from '../services/showtime.service';

export default class ShowTimeController {
  static async getAll(req: Request, res: Response) {
    try {
      const showtimes = await ShowtimeService.getAll();
      res.json(showtimes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch showtimes' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const showtime = await ShowtimeService.getById(Number(req.params.id));
      if (!showtime) return res.status(404).json({ error: 'Showtime not found' });
      res.json(showtime);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch showtime' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newShowtime = await ShowtimeService.create(req.body);
      res.status(201).json(newShowtime);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create showtime' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedShowtime = await ShowtimeService.update(Number(req.params.id), req.body);
      if (!updatedShowtime) return res.status(404).json({ error: 'Showtime not found' });
      res.json(updatedShowtime);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update showtime' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await ShowtimeService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Showtime not found' });
      res.json({ message: 'Showtime deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete showtime' });
    }
  }
}
