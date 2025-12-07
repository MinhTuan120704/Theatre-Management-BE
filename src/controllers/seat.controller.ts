import { Request, Response } from 'express';
import { SeatService } from '../services/seat.service';

export default class SeatController {
  static async getAll(req: Request, res: Response) {
    try {
      const seats = await SeatService.getAll();
      res.json(seats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch seats' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const seat = await SeatService.getById(Number(req.params.id));
      if (!seat) return res.status(404).json({ error: 'Seat not found' });
      res.json(seat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch seat' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newSeat = await SeatService.create(req.body);
      res.status(201).json(newSeat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create seat' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedSeat = await SeatService.update(Number(req.params.id), req.body);
      if (!updatedSeat) return res.status(404).json({ error: 'Seat not found' });
      res.json(updatedSeat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update seat' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await SeatService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Seat not found' });
      res.json({ message: 'Seat deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete seat' });
    }
  }
}
