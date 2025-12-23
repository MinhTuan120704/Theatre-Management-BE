import { Request, Response } from 'express';
import { SeedingService } from '../services/seeding.service';

export class SeedingController {
  static async seed(req: Request, res: Response) {
    try {
      await SeedingService.seedAll();
      res.status(200).json({ message: 'Seeding completed successfully' });
    } catch (error) {
      console.error('Seeding error:', error);
      res.status(500).json({ message: 'Seeding failed' });
    }
  }

  static async clear(req: Request, res: Response) {
    try {
      await SeedingService.clearAll();
      res.status(200).json({ message: 'Clearing completed successfully' });
    } catch (error) {
      console.error('Clearing error:', error);
      res.status(500).json({ message: 'Clearing failed' });
    }
  }
}