import Cinema from '../models/cinema.model';

export class CinemaService {
  static async create(data: any) {
    return Cinema.create(data);
  }

  static async getAll(limit?: number, offset?: number) {
    const options: any = {};
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;
    const { count, rows } = await Cinema.findAndCountAll(options);
    return { cinemas: rows, total: count };
  }

  static async getById(cinema_id: number) {
    return Cinema.findByPk(cinema_id);
  }

  static async update(cinema_id: number, data: Partial<Cinema>) {
    const cinema = await Cinema.findByPk(cinema_id);
    if (!cinema) return null;
    return cinema.update(data);
  }

  static async delete(cinema_id: number) {
    const cinema = await Cinema.findByPk(cinema_id);
    if (!cinema) return null;
    await cinema.destroy();
    return true;
  }
}
