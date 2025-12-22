import { Op } from 'sequelize';
import Movie from '../models/movie.model';
import ShowTime from '../models/showTime.model';
import Room from '../models/room.model';

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

  static async getMoviesByCinemaId(cinemaId: number) {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const showTimes = await ShowTime.findAll({
      where: {
        showTime: {
          [Op.gte]: now,
          [Op.lte]: sevenDaysLater
        }
      },
      include: [
        {
          model: Room,
          where: { cinemaId },
          attributes: []
        },
        {
          model: Movie,
          attributes: []
        }
      ]
    });

    const movieIds = [...new Set(showTimes.map(st => st.movieId))];

    const movies = await Movie.findAll({
      where: { id: movieIds },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    return movies;
  }

  static async getUpcoming(limit?: number, offset?: number) {
    const now = new Date();
    const options: any = {
      where: {
        releaseDate: {
          [Op.gt]: now
        }
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['releaseDate', 'ASC']]
    };
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;
    const { count, rows } = await Movie.findAndCountAll(options);
    return { movies: rows, total: count };
  }
}
