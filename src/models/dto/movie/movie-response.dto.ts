export interface MovieResponseDto {
  movie_id: number;
  title: string;
  genre: any;
  description: string;
  director: string;
  actors: any;
  country: string;
  duration: number;
  release_date: Date;
  poster_url: string;
  trailer_url: string;
}
