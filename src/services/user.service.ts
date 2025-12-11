import User from '../models/user.model';
import bcrypt from 'bcryptjs';

export class UserService {
  static async create(data: any) {
    if (data.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      data.passwordHash = await bcrypt.hash(data.passwordHash, salt);
    }
    return User.create(data);
  }

  static async getAll() {
    return User.findAll();
  }

  static async getById(user_id: number) {
    return User.findByPk(user_id);
  }

  static async update(user_id: number, data: Partial<User>) {
    const user = await User.findByPk(user_id);
    if (!user) return null;
    if (data.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      data.passwordHash = await bcrypt.hash(data.passwordHash, salt);
    }
    return user.update(data);
  }

  static async delete(user_id: number) {
    const user = await User.findByPk(user_id);
    if (!user) return null;
    await user.destroy();
    return true;
  }

  static async getByEmail(email: string) {
    return User.findOne({ where: { email } });
  }
}
