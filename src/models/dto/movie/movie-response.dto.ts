export interface MovieResponseDto {
  id: number;
  title: string;
  genres: string[];
  description: string;
  director: string;
  actors: string[];
  country: string;
  durationMinutes: number;
  releaseDate: Date;
  posterUrl: string;
  trailerUrl: string;
}
