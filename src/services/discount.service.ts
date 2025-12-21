import Discount from '../models/discount.model';

export class DiscountService {
  static async create(data: any) {
    return Discount.create(data);
  }

  static async getAll(limit?: number, offset?: number) {
    const options: any = {};
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;
    const { count, rows } = await Discount.findAndCountAll(options);
    return { discounts: rows, total: count };
  }

  static async getById(discount_id: number) {
    return Discount.findByPk(discount_id);
  }

  static async update(discount_id: number, data: Partial<Discount>) {
    const discount = await Discount.findByPk(discount_id);
    if (!discount) return null;
    return discount.update(data);
  }

  static async delete(discount_id: number) {
    const discount = await Discount.findByPk(discount_id);
    if (!discount) return null;
    await discount.destroy();
    return true;
  }
}
