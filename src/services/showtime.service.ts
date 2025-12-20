import e from 'express';
import Showtime from '../models/showTime.model';

export class ShowtimeService {
  static async create(data: any) {
    return Showtime.create(data);
  }

  static async getAll(limit?: number, offset?: number) {
    const options: any = {};
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;
    const { count, rows } = await Showtime.findAndCountAll(options);
    return { showtimes: rows, total: count };
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

export default ShowtimeService;
