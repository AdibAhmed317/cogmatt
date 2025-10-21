// Domain Layer - Repository Interface (Port)
// Defines auth contracts without implementation details

import { User } from '../entities/UserEntity';
import { RefreshToken } from '../entities/RefreshTokenEntity';

export interface IAuthRepository {
  Register(name: string, email: string, password: string): Promise<User>;
  FindByEmail(email: string): Promise<User | null>;
  FindById(id: string): Promise<User | null>;
  VerifyPassword(password: string, hashedPassword: string): Promise<boolean>;
  SaveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<RefreshToken>;
  FindRefreshToken(token: string): Promise<RefreshToken | null>;
  DeleteRefreshToken(token: string): Promise<void>;
  DeleteAllUserRefreshTokens(userId: string): Promise<void>;
}
