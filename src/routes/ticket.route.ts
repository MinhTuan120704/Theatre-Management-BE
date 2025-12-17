import { Router } from "express";
import TicketController from "../controllers/ticket.controller";
import {
  authenticate,
  requirePermission,
  requireAnyPermission,
} from "../middlewares/auth.middleware";
import { ResourcePermissions } from "../config/permissions";

const router: Router = Router();

router.get(
  "/",
  authenticate,
  requireAnyPermission(
    ResourcePermissions.tickets.read,
    ResourcePermissions.tickets.readOwn
  ),
  TicketController.getAll
);
router.post(
  "/",
  authenticate,
  requirePermission(ResourcePermissions.tickets.create),
  TicketController.create
);
router.get(
  "/:id",
  authenticate,
  requireAnyPermission(
    ResourcePermissions.tickets.read,
    ResourcePermissions.tickets.readOwn
  ),
  TicketController.getById
);
router.patch(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.tickets.update),
  TicketController.update
);
router.delete(
  "/:id",
  authenticate,
  requirePermission(ResourcePermissions.tickets.delete),
  TicketController.delete
);

export default router;
