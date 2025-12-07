import { Router } from "express";
import ReviewController from "../controllers/review.controller";

const router: Router = Router();

router.get("/", ReviewController.getAll);
router.get("/:id", ReviewController.getById);
router.post("/", ReviewController.create);
router.patch("/:id", ReviewController.update);
router.delete("/:id", ReviewController.delete);

export default router;
