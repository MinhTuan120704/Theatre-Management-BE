import Room from '../models/room.model';
import Seat from '../models/seat.model';

export class RoomService {
  static async create(data: any) {
    return Room.create(data);
  }

  static async getAll(limit?: number, offset?: number) {
    const options: any = {};
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;
    const { count, rows } = await Room.findAndCountAll(options);
    return { rooms: rows, total: count };
  }

  static async getById(room_id: number) {
    return Room.findByPk(room_id);
  }

  static async update(room_id: number, data: Partial<Room>) {
    const room = await Room.findByPk(room_id);
    if (!room) return null;
    return room.update(data);
  }

  static async delete(room_id: number) {
    const room = await Room.findByPk(room_id);
    if (!room) return null;
    await room.destroy();
    return true;
  }

  static async createSeatForRoom(roomId: number, seatData: { seatNumber: string; isReserved?: boolean }) {
    return Seat.create({
      roomId,
      seatNumber: seatData.seatNumber,
      isReserved: seatData.isReserved ?? false,
    });
  }
}
