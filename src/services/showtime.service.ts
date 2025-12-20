import e from 'express';
import { Op } from 'sequelize';
import Showtime from '../models/showTime.model';
import Room from '../models/room.model';
import Cinema from '../models/cinema.model';

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

  static async searchShowtimebyMovieId(movieId: number) {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + 3);
    return Showtime.findAll({
      where: {
        movieId,
        showTime: {
          [Op.gte]: now,
          [Op.lte]: endDate
        }
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Room,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: Cinema,
              attributes: { exclude: ['createdAt', 'updatedAt'] }
            }
          ]
        }
      ]
    });
  }
}

export default ShowtimeService;
