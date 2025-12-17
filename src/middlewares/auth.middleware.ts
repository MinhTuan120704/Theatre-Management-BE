import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import {
  Role,
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from "../config/permissions";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to verify JWT access token
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = AuthService.verifyToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    res
      .status(401)
      .json({ error: error.message || "Invalid or expired token" });
  }
};

/**
 * Middleware to check if user has specific role(s)
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden: Insufficient permissions" });
      return;
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = AuthService.verifyToken(token);

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Middleware to check if user has a specific permission
 */
export const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userRole = req.user.role as Role;

    if (!hasPermission(userRole, permission)) {
      res.status(403).json({
        error: "Forbidden: You do not have permission to perform this action",
        required: permission,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user has any of the specified permissions
 */
export const requireAnyPermission = (...permissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userRole = req.user.role as Role;

    if (!hasAnyPermission(userRole, permissions)) {
      res.status(403).json({
        error: "Forbidden: You do not have the required permissions",
        required: permissions,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user has all of the specified permissions
 */
export const requireAllPermissions = (...permissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userRole = req.user.role as Role;

    if (!hasAllPermissions(userRole, permissions)) {
      res.status(403).json({
        error: "Forbidden: You do not have all the required permissions",
        required: permissions,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check ownership (for resources like reviews, orders)
 * Use this after authenticate middleware
 */
export const requireOwnership = (
  getUserIdFromResource: (req: Request) => number | Promise<number>
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const resourceUserId = await getUserIdFromResource(req);

      // Admin can access any resource
      if (req.user.role === Role.ADMIN) {
        next();
        return;
      }

      // Check if the user owns the resource
      if (req.user.userId !== resourceUserId) {
        res.status(403).json({
          error: "Forbidden: You can only access your own resources",
        });
        return;
      }

      next();
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to verify ownership" });
    }
  };
};
