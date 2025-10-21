// Application Layer - Auth Service
// Business logic for authentication

import { AuthRepository } from '@/infrastructure/repositories/AuthRepository';
import { AuthResponseDTO } from '../dtos/AuthDTO';
import jwt from 'jsonwebtoken';

export class AuthService {
  private authRepo: AuthRepository;
  private JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
  private JWT_EXPIRES_IN = '15m'; // Access token expires in 15 minutes
  private REFRESH_TOKEN_EXPIRES_IN = '7d'; // Refresh token expires in 7 days

  constructor() {
    this.authRepo = new AuthRepository();
  }

  async Register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponseDTO> {
    // Check if user already exists
    const existingUser = await this.authRepo.FindByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user
    const user = await this.authRepo.Register(name, email, password);

    // Generate tokens
    const accessToken = this.generateAccessToken(
      user.id,
      user.email,
      user.role
    );
    const refreshToken = this.generateRefreshToken(user.id);

    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    await this.authRepo.SaveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async Login(email: string, password: string): Promise<AuthResponseDTO> {
    // Find user
    const user = await this.authRepo.FindByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.authRepo.VerifyPassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(
      user.id,
      user.email,
      user.role
    );
    const refreshToken = this.generateRefreshToken(user.id);

    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    await this.authRepo.SaveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async RefreshToken(refreshToken: string): Promise<AuthResponseDTO> {
    // Verify refresh token
    let payload: any;
    try {
      payload = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }

    // Check if token exists in database
    const storedToken = await this.authRepo.FindRefreshToken(refreshToken);
    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await this.authRepo.DeleteRefreshToken(refreshToken);
      throw new Error('Refresh token expired');
    }

    // Get user
    const user = await this.authRepo.FindById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new tokens
    const newAccessToken = this.generateAccessToken(
      user.id,
      user.email,
      user.role
    );
    const newRefreshToken = this.generateRefreshToken(user.id);

    // Delete old refresh token and save new one
    await this.authRepo.DeleteRefreshToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.authRepo.SaveRefreshToken(user.id, newRefreshToken, expiresAt);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async Logout(refreshToken: string): Promise<void> {
    await this.authRepo.DeleteRefreshToken(refreshToken);
  }

  async LogoutAll(userId: string): Promise<void> {
    await this.authRepo.DeleteAllUserRefreshTokens(userId);
  }

  private generateAccessToken(
    userId: string,
    email: string,
    role: string
  ): string {
    return jwt.sign({ userId, email, role }, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }
}
