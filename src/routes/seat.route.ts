import { Router } from "express";
import SeatController from "../controllers/seat.controller";

const router: Router = Router();

router.get("/", SeatController.getAll);
router.get("/:id", SeatController.getById);
router.post("/", SeatController.create);
router.put("/:id", SeatController.update);
router.delete("/:id", SeatController.delete);

export default router;
