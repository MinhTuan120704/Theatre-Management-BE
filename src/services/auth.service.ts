import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import RefreshToken from "../models/refreshToken.model";
import config from "../config/config";

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Generate JWT access token
   */
  private static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessExpirationMinutes,
    });
  }

  /**
   * Generate JWT refresh token
   */
  private static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpirationDays,
    });
  }

  /**
   * Generate reset password token
   */
  private static generateResetPasswordToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.resetPasswordExpirationMinutes,
    });
  }

  /**
   * Calculate expiration date for refresh token
   */
  private static getRefreshTokenExpiry(): Date {
    const expiryDate = new Date();
    const days = parseInt(config.jwt.refreshExpirationDays) || 7;
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
  }

  /**
   * Save refresh token to database
   */
  private static async saveRefreshToken(
    userId: number,
    token: string
  ): Promise<RefreshToken> {
    return RefreshToken.create({
      token,
      userId,
      expiresAt: this.getRefreshTokenExpiry(),
      isRevoked: false,
    });
  }

  /**
   * Register a new user
   */
  static async register(userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    dob?: Date;
    identifyCode: string;
    role?: "customer" | "admin" | "employee";
  }): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({
      where: { phone: userData.phone },
    });

    if (existingPhone) {
      throw new Error("User with this phone number already exists");
    }

    // Check if CCCD already exists
    const existingCCCD = await User.findOne({
      where: { identifyCode: userData.identifyCode },
    });

    if (existingCCCD) {
      throw new Error("User with this CCCD already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    // Create user
    const user = await User.create({
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      passwordHash,
      dob: userData.dob,
      identifyCode: userData.identifyCode,
      role: userData.role || "customer",
    });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    // Save refresh token
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Login user
   */
  static async login(
    email: string,
    password: string
  ): Promise<{ user: User; tokens: AuthTokens }> {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    // Save refresh token
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Logout user by revoking refresh token
   */
  static async logout(refreshToken: string): Promise<boolean> {
    try {
      // Verify token
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.secret
      ) as TokenPayload;

      // Find and revoke the token
      const token = await RefreshToken.findOne({
        where: {
          token: refreshToken,
          userId: decoded.userId,
          isRevoked: false,
        },
      });

      if (!token) {
        throw new Error("Invalid refresh token");
      }

      // Revoke token
      await token.update({ isRevoked: true });

      return true;
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.secret
      ) as TokenPayload;

      // Check if token exists and is not revoked
      const tokenRecord = await RefreshToken.findOne({
        where: {
          token: refreshToken,
          userId: decoded.userId,
          isRevoked: false,
        },
      });

      if (!tokenRecord) {
        throw new Error("Invalid refresh token");
      }

      // Check if token is expired
      if (new Date() > tokenRecord.expiresAt) {
        throw new Error("Refresh token has expired");
      }

      // Get user
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Generate new access token
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.generateAccessToken(tokenPayload);

      return { accessToken };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid refresh token");
      }
      throw error;
    }
  }

  /**
   * Generate reset password token
   */
  static async generateResetPasswordTokenForUser(
    email: string
  ): Promise<string> {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User with this email does not exist");
    }

    // Generate reset token
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const resetToken = this.generateResetPasswordToken(tokenPayload);

    return resetToken;
  }

  /**
   * Reset password using reset token
   */
  static async resetPassword(
    resetToken: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      // Verify reset token
      const decoded = jwt.verify(resetToken, config.jwt.secret) as TokenPayload;

      // Find user
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      // Update user password
      await user.update({ passwordHash });

      // Revoke all existing refresh tokens for this user
      await RefreshToken.update(
        { isRevoked: true },
        { where: { userId: user.id, isRevoked: false } }
      );

      return true;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid or expired reset token");
      }
      throw error;
    }
  }

  /**
   * Verify JWT token and return decoded payload
   */
  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token has expired");
      }
      throw new Error("Invalid token");
    }
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await user.update({ passwordHash });

    // Revoke all existing refresh tokens
    await RefreshToken.update(
      { isRevoked: true },
      { where: { userId: user.id, isRevoked: false } }
    );

    return true;
  }

  /**
   * Logout from all devices by revoking all refresh tokens
   */
  static async logoutAllDevices(userId: number): Promise<boolean> {
    await RefreshToken.update(
      { isRevoked: true },
      { where: { userId, isRevoked: false } }
    );

    return true;
  }
}
