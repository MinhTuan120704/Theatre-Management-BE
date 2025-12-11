import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export default class OrderController {
  static async getOrderByUserId(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const orders = await OrderService.getOrderByUserId(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders by user' });
    }
  }
  static async getAll(req: Request, res: Response) {
    try {
      const orders = await OrderService.getAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const order = await OrderService.getById(Number(req.params.id));
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newOrder = await OrderService.create(req.body);
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedOrder = await OrderService.update(Number(req.params.id), req.body);
      if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await OrderService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Order not found' });
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete order' });
    }
  }
}
