import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Theatre Management API",
      version: "1.0.0",
      description: `API documentation for Theatre Management System
      
## Authentication Guide

1. **Register or Login**: Use POST /api/auth/login or /api/auth/register to get your access token
2. **Authorize**: Click the "Authorize" 🔓 button at the top of this page
3. **Enter Token**: In the popup, enter your token in the format: \`Bearer YOUR_ACCESS_TOKEN\`
4. **Test APIs**: Now you can test all protected endpoints

**Note**: The accessToken expires after a certain time. Use the refreshToken to get a new accessToken via POST /api/auth/refresh-token`,
    },
    servers: [
      { url: "http://localhost:3000", description: "Local server" },
      { url: "http://localhost:4000", description: "Production server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Auth",
        description:
          "Authentication endpoints - Start here to get your access token",
      },
      {
        name: "Order",
        description: "Order management endpoints",
      },
      {
        name: "Payment",
        description: "Payment processing endpoints",
      },
      {
        name: "Movie",
        description: "Movie management endpoints",
      },
      {
        name: "Cinema",
        description: "Cinema management endpoints",
      },
      {
        name: "Seat",
        description: "Seat management endpoints",
      },
      {
        name: "Showtime",
        description: "Showtime management endpoints",
      },
      {
        name: "User",
        description: "User management endpoints",
      },
      {
        name: "Product",
        description: "Product management endpoints",
      },
      {
        name: "Discount",
        description: "Discount management endpoints",
      },
      {
        name: "Employee",
        description: "Employee management endpoints",
      },
      {
        name: "Room",
        description: "Room management endpoints",
      },
      {
        name: "Ticket",
        description: "Ticket management endpoints",
      },
      {
        name: "Review",
        description: "Review management endpoints",
      },
    ],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
    "./src/models/dto/**/*.ts",
  ], // Đường dẫn tới các file chứa swagger comment
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
