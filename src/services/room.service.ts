import Room from '../models/room.model';

export class RoomService {
  static async create(data: any) {
    return Room.create(data);
  }

  static async getAll() {
    return Room.findAll();
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
}
