import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export default class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const products = await ProductService.getAll();
      res.json(products);
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
