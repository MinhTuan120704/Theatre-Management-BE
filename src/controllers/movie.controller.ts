import { Request, Response } from 'express';
import { MovieService } from '../services/movie.service';

export default class MovieController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const offset = limit ? (page - 1) * limit : undefined;
      const result = await MovieService.getAll(limit, offset);
      const { movies, total } = result;
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: total
      };
      res.json({ movies, pagination });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const movie = await MovieService.getById(Number(req.params.id));
      if (!movie) return res.status(404).json({ error: 'Movie not found' });
      res.json(movie);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch movie' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newMovie = await MovieService.create(req.body);
      res.status(201).json(newMovie);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create movie' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedMovie = await MovieService.update(Number(req.params.id), req.body);
      if (!updatedMovie) return res.status(404).json({ error: 'Movie not found' });
      res.json(updatedMovie);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update movie' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await MovieService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Movie not found' });
      res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete movie' });
    }
  }
}
