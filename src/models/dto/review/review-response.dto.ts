export interface ReviewResponseDto {
  review_id: number;
  user_id: number;
  movie_id: number;
  rating: number;
  comment: string;
  created_at: Date;
}
