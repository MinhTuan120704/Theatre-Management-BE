import { Router } from "express";
import DiscountController from "../controllers/discount.controller";

const router: Router = Router();

router.get("/", DiscountController.getAll);
router.get("/:id", DiscountController.getById);
router.post("/", DiscountController.create);
router.patch("/:id", DiscountController.update);
router.delete("/:id", DiscountController.delete);

export default router;
