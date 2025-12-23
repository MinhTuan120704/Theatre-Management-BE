import { Router } from 'express';
import { SeedingController } from '../controllers/seeding.controller';

const router = Router();

router.post('/seed', SeedingController.seed);
router.post('/clear', SeedingController.clear);

export default router;