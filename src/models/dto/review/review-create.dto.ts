export interface ReviewCreateDto {
  userId: number;
  movieId: number;
  rating: number;
  comment: string;
}
