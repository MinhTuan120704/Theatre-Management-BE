import { Router } from "express";
import authRoute from "./auth.route";
import cinemaRoute from "./cinema.route";
import discountRoute from "./discount.route";
import employeeRoute from "./employee.route";
import movieRoute from "./movie.route";
import orderRoute from "./order.route";
import paymentRoute from "./payment.route";
import productRoute from "./product.route";
import reviewRoute from "./review.route";
import roomRoute from "./room.route";
import seatRoute from "./seat.route";
import showtimeRoute from "./showtime.route";
import ticketRoute from "./ticket.route";
import userRoute from "./user.route";

const router: Router = Router();

router.use("/auth", authRoute);
router.use("/cinemas", cinemaRoute);
router.use("/discounts", discountRoute);
router.use("/employees", employeeRoute);
router.use("/movies", movieRoute);
router.use("/orders", orderRoute);
router.use("/payments", paymentRoute);
router.use("/products", productRoute);
router.use("/reviews", reviewRoute);
router.use("/rooms", roomRoute);
router.use("/seats", seatRoute);
router.use("/showtimes", showtimeRoute);
router.use("/tickets", ticketRoute);
router.use("/users", userRoute);

export default router;
