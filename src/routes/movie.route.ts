import { Router } from "express";
import MovieController from "../controllers/movie.controller";

const router: Router = Router();

router.get("/", MovieController.getAll);
router.get("/:id", MovieController.getById);
router.post("/", MovieController.create);
router.patch("/:id", MovieController.update);
router.delete("/:id", MovieController.delete);

export default router;
