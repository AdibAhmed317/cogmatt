// Infrastructure Layer - Auth Repository Implementation
// Concrete implementation with bcrypt and database

import { eq } from 'drizzle-orm';
import { db } from '../database/drizzle';
import { users, refreshTokens } from '../database/schema';
import { User } from '@/domain/entities/UserEntity';
import { RefreshToken } from '@/domain/entities/RefreshTokenEntity';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';

export class AuthRepository implements IAuthRepository {
  async Register(name: string, email: string, password: string): Promise<User> {
    // Hash password with bcrypt
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: 'user',
        emailVerified: false,
      })
      .returning();

    return new User(
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.role,
      newUser.emailVerified,
      newUser.createdAt,
      newUser.updatedAt
    );
  }

  async FindByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) return null;

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.emailVerified,
      user.createdAt,
      user.updatedAt
    );
  }

  async FindById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) return null;

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.emailVerified,
      user.createdAt,
      user.updatedAt
    );
  }

  async VerifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hashedPassword);
  }

  async SaveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<RefreshToken> {
    const [savedToken] = await db
      .insert(refreshTokens)
      .values({
        userId,
        token,
        expiresAt,
      })
      .returning();

    return new RefreshToken(
      savedToken.id,
      savedToken.userId,
      savedToken.token,
      savedToken.expiresAt,
      savedToken.createdAt
    );
  }

  async FindRefreshToken(token: string): Promise<RefreshToken | null> {
    const [refreshToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token));

    if (!refreshToken) return null;

    return new RefreshToken(
      refreshToken.id,
      refreshToken.userId,
      refreshToken.token,
      refreshToken.expiresAt,
      refreshToken.createdAt
    );
  }

  async DeleteRefreshToken(token: string): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  }

  async DeleteAllUserRefreshTokens(userId: string): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }
}
