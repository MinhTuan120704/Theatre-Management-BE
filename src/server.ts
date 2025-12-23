import "reflect-metadata";
import app from "./app";
import config from "./config/config";
import sequelize from "./config/database";
import { PaymentScheduler } from "./schedulers/payment.scheduler";

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

checkConnection().then(() => {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);

    // Khởi động payment scheduler để tự động hủy order hết hạn
    PaymentScheduler.start();
  });
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...");
  PaymentScheduler.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nShutting down gracefully...");
  PaymentScheduler.stop();
  process.exit(0);
});
