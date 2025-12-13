import apiRouter from './routes/index';
import express from "express";
import type { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app: Application = express();

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Theatre Management API',
      version: '1.0.0',
      description: 'API documentation for Theatre Management System',
    },
    servers: [
      { url: 'http://localhost:8000', description: 'Local server' },
      { url: 'http://localhost:4000', description: 'Production server' }
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/models/dto/**/*.ts'], // Đường dẫn tới các file chứa swagger comment
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Theatre Management Backend is running.");
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
