import { Router } from 'express';
import DiscountController from '../controllers/discount.controller';

const router = Router();

router.get('/', DiscountController.getAll);
router.get('/:id', DiscountController.getById);
router.post('/', DiscountController.create);
router.put('/:id', DiscountController.update);
router.delete('/:id', DiscountController.delete);

export default router;
