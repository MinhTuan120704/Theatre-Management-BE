export interface RoomCreateDto {
  cinema_id: number;
  name: string;
  seat_count: number;
  seats?: Array<{
    seat_name: string;
    seat_column: string;
  }>;
}
