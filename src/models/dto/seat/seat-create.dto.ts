export interface SeatCreateDto {
  roomId: number;
  seatNumber: string;
  isReserved?: boolean;
}
