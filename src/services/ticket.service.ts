import Ticket from '../models/ticket.model';

export class TicketService {
  static async create(data: any) {
    return Ticket.create(data);
  }

  static async getAll() {
    return Ticket.findAll();
  }

  static async getById(ticket_id: number) {
    return Ticket.findByPk(ticket_id);
  }

  static async update(ticket_id: number, data: Partial<Ticket>) {
    const ticket = await Ticket.findByPk(ticket_id);
    if (!ticket) return null;
    return ticket.update(data);
  }

  static async delete(ticket_id: number) {
    const ticket = await Ticket.findByPk(ticket_id);
    if (!ticket) return null;
    await ticket.destroy();
    return true;
  }
}
