import { Request, Response } from 'express';
import { ShowtimeService } from '../services/showtime.service';

export default class ShowTimeController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const offset = limit ? (page - 1) * limit : undefined;
      const result = await ShowtimeService.getAll(limit, offset);
      const { showtimes, total } = result;
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: total
      };
      res.json({ showtimes, pagination });
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

  static async searchShowtimebyMovieId(req: Request, res: Response) {
    try {
      const movieId = Number(req.params.movieId);
      const showtimes = await ShowtimeService.searchShowtimebyMovieId(movieId);
      res.json({ showtimes });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch showtimes by movie ID' });
    }
  }
}
