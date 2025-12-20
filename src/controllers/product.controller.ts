import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export default class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const offset = limit ? (page - 1) * limit : undefined;
      const result = await ProductService.getAll(limit, offset);
      const { products, total } = result;
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: total
      };
      res.json({ products, pagination });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const product = await ProductService.getById(Number(req.params.id));
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newProduct = await ProductService.create(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedProduct = await ProductService.update(Number(req.params.id), req.body);
      if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await ProductService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Product not found' });
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
}
