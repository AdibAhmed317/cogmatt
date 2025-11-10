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
        authProvider: 'credentials',
        role: 'user',
        emailVerified: false,
      })
      .returning();

    return new User(
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.googleId,
      newUser.authProvider,
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
      user.googleId,
      user.authProvider,
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
      user.googleId,
      user.authProvider,
      user.role,
      user.emailVerified,
      user.createdAt,
      user.updatedAt
    );
  }

  async FindByGoogleId(googleId: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId));

    if (!user) return null;

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.googleId,
      user.authProvider,
      user.role,
      user.emailVerified,
      user.createdAt,
      user.updatedAt
    );
  }

  async FindOrCreateGoogleUser(
    googleId: string,
    email: string,
    name: string
  ): Promise<User> {
    // First check if user exists by Google ID
    const existingUser = await this.FindByGoogleId(googleId);
    if (existingUser) {
      return existingUser;
    }

    // Check if user exists by email (user might have signed up with credentials first)
    const userByEmail = await this.FindByEmail(email);
    if (userByEmail) {
      // Link Google account to existing user
      const [updatedUser] = await db
        .update(users)
        .set({
          googleId,
          authProvider: 'google',
          emailVerified: true, // Google accounts are verified
          updatedAt: new Date(),
        })
        .where(eq(users.email, email))
        .returning();

      return new User(
        updatedUser.id,
        updatedUser.name,
        updatedUser.email,
        updatedUser.password,
        updatedUser.googleId,
        updatedUser.authProvider,
        updatedUser.role,
        updatedUser.emailVerified,
        updatedUser.createdAt,
        updatedUser.updatedAt
      );
    }

    // Create new user with Google
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        googleId,
        authProvider: 'google',
        password: null, // No password for OAuth users
        role: 'user',
        emailVerified: true, // Google accounts are verified
      })
      .returning();

    return new User(
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.googleId,
      newUser.authProvider,
      newUser.role,
      newUser.emailVerified,
      newUser.createdAt,
      newUser.updatedAt
    );
  }

  async UpdatePassword(userId: string, newPassword: string): Promise<void> {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async UpdateProfile(
    userId: string,
    name?: string,
    email?: string
  ): Promise<User> {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    return new User(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.password,
      updatedUser.googleId,
      updatedUser.authProvider,
      updatedUser.role,
      updatedUser.emailVerified,
      updatedUser.createdAt,
      updatedUser.updatedAt
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
