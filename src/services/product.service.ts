import Product from '../models/product.model';

export class ProductService {
  static async create(data: any) {
    return Product.create(data);
  }

  static async getAll(limit?: number, offset?: number) {
    const options: any = {};
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;
    const { count, rows } = await Product.findAndCountAll(options);
    return { products: rows, total: count };
  }

  static async getById(product_id: number) {
    return Product.findByPk(product_id);
  }

  static async update(product_id: number, data: Partial<Product>) {
    const product = await Product.findByPk(product_id);
    if (!product) return null;
    return product.update(data);
  }

  static async delete(product_id: number) {
    const product = await Product.findByPk(product_id);
    if (!product) return null;
    await product.destroy();
    return true;
  }
}
