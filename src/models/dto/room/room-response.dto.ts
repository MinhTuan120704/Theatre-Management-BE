export interface RoomResponseDto {
  id: number;
  cinemaId: number;
  name: string;
  capacity: number;
  cinema?: {
    name: string;
    address: string;
  };
}
