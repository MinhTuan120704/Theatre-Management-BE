import { Router } from "express";
import OrderController from "../controllers/order.controller";

const router: Router = Router();

router.get("/", OrderController.getAll);
router.get("/:id", OrderController.getById);
router.get('/user/:userId', OrderController.getOrderByUserId);
router.post("/", OrderController.create);
router.patch("/:id", OrderController.update);
router.delete("/:id", OrderController.delete);

export default router;
