export interface RoomResponseDto {
  room_id: number;
  cinema_id: number;
  name: string;
  seat_count: number;
  cinema?: {
    name: string;
    address: string;
  };
}
