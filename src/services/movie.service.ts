import Movie from '../models/movie.model';

export class MovieService {
  static async create(data: any) {
    return Movie.create(data);
  }

  static async getAll() {
    return Movie.findAll();
  }

  static async getById(movie_id: number) {
    return Movie.findByPk(movie_id);
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
