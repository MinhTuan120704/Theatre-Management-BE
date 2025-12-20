import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';

export default class TicketController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const offset = limit ? (page - 1) * limit : undefined;
      const result = await TicketService.getAll(limit, offset);
      const { tickets, total } = result;
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: total
      };
      res.json({ tickets, pagination });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const ticket = await TicketService.getById(Number(req.params.id));
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ticket' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newTicket = await TicketService.create(req.body);
      res.status(201).json(newTicket);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedTicket = await TicketService.update(Number(req.params.id), req.body);
      if (!updatedTicket) return res.status(404).json({ error: 'Ticket not found' });
      res.json(updatedTicket);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update ticket' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await TicketService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Ticket not found' });
      res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete ticket' });
    }
  }
}
