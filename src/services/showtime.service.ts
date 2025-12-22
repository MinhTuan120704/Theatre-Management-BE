import e from 'express';
import { Op } from 'sequelize';
import Showtime from '../models/showTime.model';
import Room from '../models/room.model';
import Cinema from '../models/cinema.model';
import Movie from '../models/movie.model';

export class ShowtimeService {
  static async create(data: any) {
    const { movieId, roomId, showTime } = data;

    // Lấy thông tin phim để có duration
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    const durationMs = movie.durationMinutes * 60000; // chuyển phút thành ms
    const newStart = new Date(showTime);
    const newEnd = new Date(newStart.getTime() + durationMs);

    // Xác định khoảng thời gian trong ngày
    const startOfDay = new Date(newStart);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(newStart);
    endOfDay.setHours(23, 59, 59, 999);

    // Lấy các showtime hiện có trong cùng phòng và cùng ngày
    const existingShowtimes = await Showtime.findAll({
      where: {
        roomId,
        showTime: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay
        }
      },
      include: [Movie]
    });

    // Kiểm tra trùng lịch
    for (const existing of existingShowtimes) {
      const existingStart = new Date(existing.showTime);
      const existingEnd = new Date(existingStart.getTime() + durationMs);
      if (newStart < existingEnd && newEnd > existingStart) {
        throw new Error('Showtime conflicts with existing showtime');
      }
    }

    // Nếu không trùng, tạo mới
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

  static async getShowtimesByCinemaMovieDate(cinemaId: number, movieId: number, date: string) {
    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');

    return Showtime.findAll({
      where: {
        movieId,
        showTime: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay
        }
      },
      include: [
        {
          model: Room,
          where: { cinemaId },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: Cinema,
              attributes: { exclude: ['createdAt', 'updatedAt'] }
            }
          ]
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
  }
}

export default ShowtimeService;
