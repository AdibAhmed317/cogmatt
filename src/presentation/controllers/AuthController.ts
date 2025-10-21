// Presentation Layer - Auth Controller
// Handles HTTP requests/responses for auth

import { Hono, Context } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { AuthService } from '@/application/services/AuthService';
import { validateDTO } from '@/application/dtos/ValidateDTO';
import { RegisterDTO, LoginDTO } from '@/application/dtos/AuthDTO';

export class AuthController {
  public router = new Hono();
  private authService = new AuthService();
  private isProduction = process.env.NODE_ENV === 'production';

  constructor() {
    // POST /register - Register new user
    this.router.post('/register', async (c) => {
      try {
        const body = await c.req.json();

        // Validate DTO
        const validation = await validateDTO(RegisterDTO, body);
        if (!validation.isValid) {
          return c.json(
            { message: 'Validation failed', errors: validation.errors },
            400
          );
        }

        const { name, email, password } = validation.dto!;
        const result = await this.authService.Register(name, email, password);

        // Set tokens in HTTP-only cookies
        this.setAuthCookies(c, result.accessToken, result.refreshToken);

        // Return user data (without tokens in body)
        return c.json(
          {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role,
            message: 'Registration successful',
          },
          201
        );
      } catch (err) {
        return c.json(
          { message: (err as Error).message || 'Registration failed' },
          400
        );
      }
    });

    // POST /login - Login user
    this.router.post('/login', async (c) => {
      try {
        const body = await c.req.json();

        // Validate DTO
        const validation = await validateDTO(LoginDTO, body);
        if (!validation.isValid) {
          return c.json(
            { message: 'Validation failed', errors: validation.errors },
            400
          );
        }

        const email = validation.dto!.email;
        const password = validation.dto!.password;
        const result = await this.authService.Login(email, password);

        // Set tokens in HTTP-only cookies
        this.setAuthCookies(c, result.accessToken, result.refreshToken);

        // Return user data (without tokens in body)
        return c.json({
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role,
          message: 'Login successful',
        });
      } catch (err) {
        return c.json(
          { message: (err as Error).message || 'Login failed' },
          401
        );
      }
    });

    // POST /refresh - Refresh access token
    this.router.post('/refresh', async (c) => {
      try {
        // Get refresh token from cookie
        const refreshToken = getCookie(c, 'refreshToken');

        if (!refreshToken) {
          return c.json({ message: 'Refresh token not found' }, 401);
        }

        const result = await this.authService.RefreshToken(refreshToken);

        // Set new tokens in cookies
        this.setAuthCookies(c, result.accessToken, result.refreshToken);

        return c.json({
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role,
          message: 'Token refreshed successfully',
        });
      } catch (err) {
        return c.json(
          { message: (err as Error).message || 'Token refresh failed' },
          401
        );
      }
    });

    // POST /logout - Logout user (invalidate refresh token)
    this.router.post('/logout', async (c) => {
      try {
        // Get refresh token from cookie
        const refreshToken = getCookie(c, 'refreshToken');

        if (refreshToken) {
          await this.authService.Logout(refreshToken);
        }

        // Clear cookies
        this.clearAuthCookies(c);

        return c.json({ message: 'Logged out successfully' });
      } catch (err) {
        return c.json(
          { message: (err as Error).message || 'Logout failed' },
          400
        );
      }
    });

    // GET /me - Get current user info from accessToken cookie
    this.router.get('/me', async (c) => {
      try {
        const accessToken = getCookie(c, 'accessToken');
        if (!accessToken) {
          return c.json({ message: 'Unauthorized' }, 401);
        }
        const payload = this.authService.verifyAccessToken(accessToken);
        return c.json({
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        });
      } catch (err) {
        return c.json({ message: 'Invalid or expired token' }, 401);
      }
    });
  }

  // Helper: Set auth cookies
  private setAuthCookies(
    c: Context,
    accessToken: string,
    refreshToken: string
  ) {
    // Access token cookie (15 minutes)
    setCookie(c, 'accessToken', accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'Lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    });

    // Refresh token cookie (7 days)
    setCookie(c, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  }

  // Helper: Clear auth cookies
  private clearAuthCookies(c: Context) {
    deleteCookie(c, 'accessToken', {
      path: '/',
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'Lax',
    });
    deleteCookie(c, 'refreshToken', {
      path: '/',
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'Lax',
    });
  }
}
