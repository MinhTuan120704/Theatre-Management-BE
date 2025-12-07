import Showtime from '../models/showTime.model';

export class ShowtimeService {
  static async create(data: any) {
    return Showtime.create(data);
  }

  static async getAll() {
    return Showtime.findAll();
  }

  static async getById(showtime_id: number) {
    return Showtime.findByPk(showtime_id);
  }

  static async update(showtime_id: number, data: Partial<Showtime>) {
    const showtime = await Showtime.findByPk(showtime_id);
    if (!showtime) return null;
    return showtime.update(data);
  }

  static async delete(showtime_id: number) {
    const showtime = await Showtime.findByPk(showtime_id);
    if (!showtime) return null;
    await showtime.destroy();
    return true;
  }
}
