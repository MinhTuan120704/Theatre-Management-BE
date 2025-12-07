import { Router } from "express";
import CinemaController from "../controllers/cinema.controller";

const router: Router = Router();

router.get("/", CinemaController.getAll);
router.get("/:id", CinemaController.getById);
router.post("/", CinemaController.create);
router.patch("/:id", CinemaController.update);
router.delete("/:id", CinemaController.delete);

export default router;
