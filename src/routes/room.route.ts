import { Router } from "express";
import RoomController from "../controllers/room.controller";

const router: Router = Router();

router.get("/", RoomController.getAll);
router.get("/:id", RoomController.getById);
router.post("/", RoomController.create);
router.put("/:id", RoomController.update);
router.delete("/:id", RoomController.delete);

export default router;
