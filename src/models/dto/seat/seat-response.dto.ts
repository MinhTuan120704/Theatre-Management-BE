export interface SeatResponseDto {
  id: number;
  roomId: number;
  seatNumber: string;
  isReserved: boolean; // Computed field - based on Ticket.isReserved for a specific showtime
}
