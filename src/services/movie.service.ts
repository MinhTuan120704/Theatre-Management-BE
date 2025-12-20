import { Op } from 'sequelize';
import Movie from '../models/movie.model';

export class MovieService {
  static async create(data: any) {
    return Movie.create(data);
  }

  static async getAll(limit?: number, offset?: number) {
    const options: any = {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    };
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;
    const { count, rows } = await Movie.findAndCountAll(options);
    return { movies: rows, total: count };
  }

  static async getById(movie_id: number) {
    return Movie.findByPk(movie_id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
  }

  static async update(movie_id: number, data: Partial<Movie>) {
    const movie = await Movie.findByPk(movie_id);
    if (!movie) return null;
    return movie.update(data);
  }

  static async delete(movie_id: number) {
    const movie = await Movie.findByPk(movie_id);
    if (!movie) return null;
    await movie.destroy();
    return true;
  }
}
