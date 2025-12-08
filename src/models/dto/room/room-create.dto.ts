export interface RoomCreateDto {
  cinemaId: number;
  name: string;
  capacity: number;
  seats?: Array<{
    seat_name: string;
    seat_column: string;
  }>;
}
