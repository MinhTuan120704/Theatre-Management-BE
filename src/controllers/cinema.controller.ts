import { Request, Response } from 'express';
import { CinemaService } from '../services/cinema.service';

export default class CinemaController {
  static async getAll(req: Request, res: Response) {
    try {
      const cinemas = await CinemaService.getAll();
      res.json(cinemas);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cinemas' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const cinema = await CinemaService.getById(Number(req.params.id));
      if (!cinema) return res.status(404).json({ error: 'Cinema not found' });
      res.json(cinema);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cinema' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newCinema = await CinemaService.create(req.body);
      res.status(201).json(newCinema);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create cinema' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedCinema = await CinemaService.update(Number(req.params.id), req.body);
      if (!updatedCinema) return res.status(404).json({ error: 'Cinema not found' });
      res.json(updatedCinema);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update cinema' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await CinemaService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Cinema not found' });
      res.json({ message: 'Cinema deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete cinema' });
    }
  }
}
