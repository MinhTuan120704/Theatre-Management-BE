import { Request, Response } from 'express';
import { SeatService } from '../services/seat.service';

export default class SeatController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const offset = limit ? (page - 1) * limit : undefined;
      const result = await SeatService.getAll(limit, offset);
      const { seats, total } = result;
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: total
      };
      res.json({ seats, pagination });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch seats' });
    }
  }

  static async getByRoomId(req: Request, res: Response) {
    try {
      const roomId = Number(req.params.roomId);
      const seats = await SeatService.getByRoomId(roomId);
      res.json(seats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch seats by room' });
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

  static async getByShowtimeId(req: Request, res: Response) {
    try {
      const showtimeId = Number(req.params.showtimeId);
      const seats = await SeatService.getByShowtimeId(showtimeId);
      res.json(seats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch seats by showtime' });
    }
  }
}
