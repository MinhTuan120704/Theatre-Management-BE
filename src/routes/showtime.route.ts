import { Router } from "express";
import ShowTimeController from "../controllers/showtime.controller";

const router: Router = Router();

router.get("/", ShowTimeController.getAll);
router.get("/:id", ShowTimeController.getById);
router.post("/", ShowTimeController.create);
router.patch("/:id", ShowTimeController.update);
router.delete("/:id", ShowTimeController.delete);

export default router;
