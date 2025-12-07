export interface ReviewCreateDto {
  user_id: number;
  movie_id: number;
  rating: number;
  comment: string;
}
