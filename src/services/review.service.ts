import Review from '../models/review.model';

export class ReviewService {
  static async create(data: any) {
    return Review.create(data);
  }

  static async getAll() {
    return Review.findAll();
  }

  static async getById(review_id: number) {
    return Review.findByPk(review_id);
  }

  static async update(review_id: number, data: Partial<Review>) {
    const review = await Review.findByPk(review_id);
    if (!review) return null;
    return review.update(data);
  }

  static async delete(review_id: number) {
    const review = await Review.findByPk(review_id);
    if (!review) return null;
    await review.destroy();
    return true;
  }
}
