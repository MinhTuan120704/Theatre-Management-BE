import { Router } from "express";
import SeatController from "../controllers/seat.controller";

const router: Router = Router();

router.get("/", SeatController.getAll);
router.get("/:id", SeatController.getById);
router.get('/room/:roomId', SeatController.getByRoomId);
router.get('/showtime/:showtimeId', SeatController.getByShowtimeId);
router.post("/", SeatController.create);
router.patch("/:id", SeatController.update);
router.delete("/:id", SeatController.delete);

export default router;
