import { Request, Response } from 'express';
import { MovieService } from '../services/movie.service';

export default class MovieController {
  static async getAll(req: Request, res: Response) {
    try {
      const movies = await MovieService.getAll();
      res.json(movies);
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
