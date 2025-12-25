import Ticket from "../models/ticket.model";
import Seat from "../models/seat.model";
import ShowTime from "../models/showTime.model";

export class SeatService {
  static async getByShowtimeId(showtimeId: number) {
    // Lấy tất cả ticket của showtimeId (chỉ lấy những ticket đang được đặt - isReserved = true)
    const tickets = await Ticket.findAll({
      where: {
        showtimeId,
        isReserved: true, // Chỉ lấy ticket đang được đặt
      },
    });
    const reservedSeatIds = tickets.map((t) => t.seatId);

    // Lấy showtime để biết roomId
    const showtime = await ShowTime.findByPk(showtimeId);
    if (!showtime) return [];

    // Lấy tất cả seat thuộc roomId của showtime
    const seats = await Seat.findAll({ where: { roomId: showtime.roomId } });
    return seats.map((seat) => ({
      ...seat.toJSON(),
      isReserved: reservedSeatIds.includes(seat.id),
    }));
  }
  static async create(data: any) {
    return Seat.create(data);
  }

  static async getAll(limit?: number, offset?: number) {
    const options: any = {};
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;
    const { count, rows } = await Seat.findAndCountAll(options);
    return { seats: rows, total: count };
  }

  static async getById(seat_id: number) {
    return Seat.findByPk(seat_id);
  }

  static async update(seat_id: number, data: Partial<Seat>) {
    const seat = await Seat.findByPk(seat_id);
    if (!seat) return null;
    return seat.update(data);
  }

  static async delete(seat_id: number) {
    const seat = await Seat.findByPk(seat_id);
    if (!seat) return null;
    await seat.destroy();
    return true;
  }

  static async getByRoomId(roomId: number) {
    return Seat.findAll({ where: { roomId } });
  }
}
