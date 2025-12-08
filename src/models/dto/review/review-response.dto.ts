export interface ReviewResponseDto {
  id: number;
  userId: number;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: Date;
}
