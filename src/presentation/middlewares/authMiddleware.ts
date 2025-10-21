// Presentation Layer - JWT Auth Middleware
// Protects routes by verifying JWT tokens from cookies

import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { AuthService } from '@/application/services/AuthService';

const authService = new AuthService();

export async function authMiddleware(c: Context, next: Next) {
  try {
    // Get access token from cookie
    const accessToken = getCookie(c, 'accessToken');

    if (!accessToken) {
      return c.json({ message: 'No token provided. Please login.' }, 401);
    }

    // Verify token
    const payload = authService.verifyAccessToken(accessToken);

    // Attach user info to context
    c.set('userId', payload.userId);
    c.set('userEmail', payload.email);

    await next();
  } catch (error) {
    return c.json(
      { message: (error as Error).message || 'Invalid or expired token' },
      401
    );
  }
}
