import { Router } from 'express';
import CinemaController from '../controllers/cinema.controller';

const router = Router();

router.get('/', CinemaController.getAll);
router.get('/:id', CinemaController.getById);
router.post('/', CinemaController.create);
router.put('/:id', CinemaController.update);
router.delete('/:id', CinemaController.delete);

export default router;
