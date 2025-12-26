import { Request, Response } from "express";
import { OrderService } from "../services/order.service";

export default class OrderController {
  static async getOrderByUserId(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const orders = await OrderService.getOrderByUserId(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders by user" });
    }
  }
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const offset = limit ? (page - 1) * limit : undefined;
      const result = await OrderService.getAll(limit, offset);
      const { orders, total } = result;
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: total,
      };
      res.json({ orders, pagination });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const order = await OrderService.getById(Number(req.params.id));
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newOrder = await OrderService.create(req.body);
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedOrder = await OrderService.update(
        Number(req.params.id),
        req.body
      );
      if (!updatedOrder)
        return res.status(404).json({ error: "Order not found" });
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await OrderService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Order not found" });
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  }

  static async cancelOrder(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.id);
      const userId = req.user?.userId; // Lấy userId từ token đã authenticate

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await OrderService.cancelOrder(orderId, userId);
      res.json(result);
    } catch (error: any) {
      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("Unauthorized")
        ? 403
        : error.message.includes("Cannot cancel")
        ? 400
        : error.message.includes("already been cancelled")
        ? 400
        : 500;

      res.status(statusCode).json({
        error: error.message || "Failed to cancel order",
      });
    }
  }
}
