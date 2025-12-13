
import { Router } from "express";
import TicketController from "../controllers/ticket.controller";

const router: Router = Router();

router.get("/", TicketController.getAll);
router.post("/", TicketController.create);
router.get("/:id", TicketController.getById);
router.patch("/:id", TicketController.update);
router.delete("/:id", TicketController.delete);

export default router;
