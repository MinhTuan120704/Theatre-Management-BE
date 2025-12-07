import { Request, Response } from 'express';
import { RoomService } from '../services/room.service';

export default class RoomController {
  static async getAll(req: Request, res: Response) {
    try {
      const rooms = await RoomService.getAll();
      res.json(rooms);
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
