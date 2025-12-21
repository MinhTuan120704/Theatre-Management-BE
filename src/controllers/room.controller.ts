import { Request, Response } from 'express';
import { RoomService } from '../services/room.service';

export default class RoomController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const offset = limit ? (page - 1) * limit : undefined;
      const result = await RoomService.getAll(limit, offset);
      const { rooms, total } = result;
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: total
      };
      res.json({ rooms, pagination });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rooms' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const room = await RoomService.getById(Number(req.params.id));
      if (!room) return res.status(404).json({ error: 'Room not found' });
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch room' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newRoom = await RoomService.create(req.body);
      // Nếu có danh sách seats trong DTO, tạo ghế cho phòng mới
      if (req.body.seats && Array.isArray(req.body.seats)) {
        await Promise.all(
          req.body.seats.map((seat: any) =>
            RoomService.createSeatForRoom(newRoom.id, seat)
          )
        );
      }
      res.status(201).json(newRoom);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create room' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedRoom = await RoomService.update(Number(req.params.id), req.body);
      if (!updatedRoom) return res.status(404).json({ error: 'Room not found' });
      res.json(updatedRoom);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update room' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await RoomService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Room not found' });
      res.json({ message: 'Room deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete room' });
    }
  }
}
