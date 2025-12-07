import Cinema from '../models/cinema.model';

export class CinemaService {
  static async create(data: any) {
    return Cinema.create(data);
  }

  static async getAll() {
    return Cinema.findAll();
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
