import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export default class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response) {
    try {
      const { fullName, email, phone, password, dob, identifyCode, role } =
        req.body;

      // Validate required fields
      if (!fullName || !email || !phone || !password || !identifyCode) {
        return res.status(400).json({
          error:
            "Missing required fields: fullName, email, phone, password, identifyCode",
        });
      }

      const result = await AuthService.register({
        fullName,
        email,
        phone,
        password,
        ...(dob && { dob: new Date(dob) }),
        identifyCode,
        role: role || "customer",
      });

      // Remove passwordHash from response
      const userResponse = {
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
        phone: result.user.phone,
        dob: result.user.dob,
        identifyCode: result.user.identifyCode,
        role: result.user.role,
        createdAt: result.user.createdAt,
      };

      res.status(201).json({
        message: "Sign up successfully",
        user: userResponse,
        tokens: result.tokens,
      });
    } catch (error: any) {
      res
        .status(400)
        .json({ error: error.message || "Your entered email had existed in the system. Please check again." });
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      const result = await AuthService.login(email, password);

      // Remove passwordHash from response
      const userResponse = {
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
        phone: result.user.phone,
        dob: result.user.dob,
        identifyCode: result.user.identifyCode,
        role: result.user.role,
        createdAt: result.user.createdAt,
      };

      res.json({
        message: "Sign in successfully",
        user: userResponse,
        tokens: result.tokens,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Your username or password might be wrong. Please check and try again later." });
    }
  }

  /**
   * Logout user
   */
  static async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: "Refresh token is required",
        });
      }

      await AuthService.logout(refreshToken);

      res.json({
        message: "Logout successful",
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to logout" });
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: "Refresh token is required",
        });
      }

      const result = await AuthService.refreshAccessToken(refreshToken);

      res.json({
        message: "Token refreshed successfully",
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      res
        .status(401)
        .json({ error: error.message || "Failed to refresh token" });
    }
  }

  /**
   * Request password reset token
   */
  static async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: "Email is required",
        });
      }

      const resetToken = await AuthService.generateResetPasswordTokenForUser(
        email
      );

      res.json({
        message: "Password reset token generated successfully",
        resetToken,
      });
    } catch (error: any) {
      res
        .status(400)
        .json({ error: error.message || "Failed to generate reset token" });
    }
  }

  /**
   * Reset password using reset token
   */
  static async resetPassword(req: Request, res: Response) {
    try {
      const { resetToken, newPassword } = req.body;

      if (!resetToken || !newPassword) {
        return res.status(400).json({
          error: "Reset token and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long",
        });
      }

      await AuthService.resetPassword(resetToken, newPassword);

      res.json({
        message: "Password reset successfully",
      });
    } catch (error: any) {
      res
        .status(400)
        .json({ error: error.message || "Failed to reset password" });
    }
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = (req as any).user?.userId; // Assumes auth middleware sets user

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Current password and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: "New password must be at least 6 characters long",
        });
      }

      if (!userId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      await AuthService.changePassword(userId, currentPassword, newPassword);

      res.json({
        message: "Password changed successfully",
      });
    } catch (error: any) {
      res
        .status(400)
        .json({ error: error.message || "Failed to change password" });
    }
  }

  /**
   * Logout from all devices
   */
  static async logoutAllDevices(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId; // Assumes auth middleware sets user

      if (!userId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      await AuthService.logoutAllDevices(userId);

      res.json({
        message: "Logged out from all devices successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message || "Failed to logout from all devices",
      });
    }
  }

  /**
   * Verify token
   */
  static async verifyToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          error: "Token is required",
        });
      }

      const decoded = AuthService.verifyToken(token);

      res.json({
        message: "Token is valid",
        payload: decoded,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Invalid token" });
    }
  }
}
