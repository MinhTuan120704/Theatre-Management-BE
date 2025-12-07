import Product from '../models/product.model';

export class ProductService {
  static async create(data: any) {
    return Product.create(data);
  }

  static async getAll() {
    return Product.findAll();
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
