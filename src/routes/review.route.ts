import { Router } from 'express';
import ReviewController from '../controllers/review.controller';

const router = Router();

router.get('/', ReviewController.getAll);
router.get('/:id', ReviewController.getById);
router.post('/', ReviewController.create);
router.put('/:id', ReviewController.update);
router.delete('/:id', ReviewController.delete);

export default router;
