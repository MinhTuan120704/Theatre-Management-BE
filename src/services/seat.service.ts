import Seat from '../models/seat.model';

export class SeatService {
  static async create(data: any) {
    return Seat.create(data);
  }

  static async getAll() {
    return Seat.findAll();
  }

  static async getById(seat_id: number) {
    return Seat.findByPk(seat_id);
  }

  static async update(seat_id: number, data: Partial<Seat>) {
    const seat = await Seat.findByPk(seat_id);
    if (!seat) return null;
    return seat.update(data);
  }

  static async delete(seat_id: number) {
    const seat = await Seat.findByPk(seat_id);
    if (!seat) return null;
    await seat.destroy();
    return true;
  }
}
