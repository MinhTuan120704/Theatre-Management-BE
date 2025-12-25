import { Router } from "express";
import type { Router as RouterType } from "express";
import { SeedingController } from "../controllers/seeding.controller";

const router: RouterType = Router();

router.post("/seed", SeedingController.seed);
router.post("/clear", SeedingController.clear);

export default router;
