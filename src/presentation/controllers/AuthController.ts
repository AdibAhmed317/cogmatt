// Presentation Layer - Auth Controller
// Handles HTTP requests/responses for auth

import { Hono, Context } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { AuthService } from '@/application/services/AuthService';
import { validateDTO } from '@/application/dtos/ValidateDTO';
import { RegisterDTO, LoginDTO } from '@/application/dtos/AuthDTO';
import { Google, generateState, generateCodeVerifier } from 'arctic';

export class AuthController {
  public router = new Hono();
  private authService = new AuthService();
  private isProduction = process.env.NODE_ENV === 'production';
  private google: Google;

  constructor() {
    // Initialize Google OAuth
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      'http://localhost:3000/api/auth/google/callback';

    if (!clientId || !clientSecret) {
      console.warn(
        '[AuthController] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET. Google OAuth will fail until configured.'
      );
    }

    this.google = new Google(clientId, clientSecret, redirectUri);

    // Initialize routes
    this.initRoutes();
  }

  private initRoutes() {
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
          accessToken: result.accessToken, // Include for scheduling refresh
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
        let accessToken = getCookie(c, 'accessToken');
        console.log(
          '[/me] accessToken from cookie:',
          accessToken ? 'present' : 'missing'
        );

        if (!accessToken) {
          // Try using refresh token to issue a new access token seamlessly
          const refreshToken = getCookie(c, 'refreshToken');
          console.log(
            '[/me] refreshToken from cookie:',
            refreshToken ? 'present' : 'missing'
          );

          if (refreshToken) {
            try {
              console.log('[/me] Attempting RefreshToken...');
              const result = await this.authService.RefreshToken(refreshToken);
              console.log(
                '[/me] RefreshToken succeeded, new accessToken issued'
              );
              // Set new cookies
              this.setAuthCookies(c, result.accessToken, result.refreshToken);
              // Use the new access token for payload
              accessToken = result.accessToken;
            } catch (err) {
              console.log('[/me] RefreshToken failed:', (err as Error).message);
              // fallthrough to unauthorized
            }
          }
        }

        if (!accessToken) {
          console.log(
            '[/me] No accessToken available after refresh attempt, returning 401'
          );
          return c.json({ message: 'Unauthorized' }, 401);
        }

        const payload = this.authService.verifyAccessToken(accessToken);
        console.log('[/me] Token verified, returning user:', payload.userId);
        return c.json({
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
          accessToken, // Include access token for scheduling refresh
        });
      } catch (err) {
        console.log('[/me] Catch block error:', (err as Error).message);
        return c.json({ message: 'Invalid or expired token' }, 401);
      }
    });

    // POST /set-password - Set or update password for current user
    this.router.post('/set-password', async (c) => {
      try {
        const accessToken = getCookie(c, 'accessToken');
        if (!accessToken) {
          return c.json({ message: 'Unauthorized' }, 401);
        }
        const payload = this.authService.verifyAccessToken(accessToken);

        const body = await c.req.json().catch(() => ({}));
        const newPassword = body?.newPassword as string | undefined;
        const currentPassword = body?.currentPassword as string | undefined;

        if (!newPassword || newPassword.length < 8) {
          return c.json(
            { message: 'Password must be at least 8 characters long' },
            400
          );
        }

        await this.authService.SetPassword(
          payload.userId,
          newPassword,
          currentPassword
        );

        return c.json({ message: 'Password updated successfully' });
      } catch (err) {
        return c.json(
          { message: (err as Error).message || 'Failed to update password' },
          400
        );
      }
    });

    // GET /google - Initiate Google OAuth flow
    this.router.get('/google', async (c) => {
      try {
        const state = generateState(); // CSRF protection
        const codeVerifier = generateCodeVerifier(); // PKCE verifier (43-128 chars)

        // Create authorization URL
        const url = await this.google.createAuthorizationURL(
          state,
          codeVerifier,
          ['openid', 'profile', 'email']
        );

        // Store state and code verifier in cookies for verification
        setCookie(c, 'google_oauth_state', state, {
          httpOnly: true,
          secure: this.isProduction,
          sameSite: 'Lax',
          maxAge: 60 * 10, // 10 minutes
          path: '/',
        });

        setCookie(c, 'google_code_verifier', codeVerifier, {
          httpOnly: true,
          secure: this.isProduction,
          sameSite: 'Lax',
          maxAge: 60 * 10, // 10 minutes
          path: '/',
        });

        // Redirect to Google
        return c.redirect(url.toString());
      } catch (err) {
        return c.json(
          { message: (err as Error).message || 'OAuth initialization failed' },
          500
        );
      }
    });

    // GET /google/callback - Handle Google OAuth callback
    this.router.get('/google/callback', async (c) => {
      try {
        const url = new URL(c.req.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        console.log('[/google/callback] Starting callback');
        console.log('[/google/callback] code:', code ? 'present' : 'missing');
        console.log('[/google/callback] state from URL:', state);

        const storedState = getCookie(c, 'google_oauth_state');
        const codeVerifier = getCookie(c, 'google_code_verifier');

        console.log('[/google/callback] storedState from cookie:', storedState);
        console.log(
          '[/google/callback] codeVerifier from cookie:',
          codeVerifier ? 'present' : 'missing'
        );

        // Verify state to prevent CSRF
        if (
          !code ||
          !state ||
          !storedState ||
          state !== storedState ||
          !codeVerifier
        ) {
          console.log('[/google/callback] CSRF/state validation failed');
          return c.redirect('/login?error=invalid_oauth_state');
        }

        console.log(
          '[/google/callback] State validated, exchanging code for tokens'
        );
        // Exchange code for tokens
        const tokens = await this.google.validateAuthorizationCode(
          code,
          codeVerifier
        );
        console.log('[/google/callback] Tokens received from Google'); // Fetch user info from Google
        const response = await fetch(
          'https://openidconnect.googleapis.com/v1/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken()}`,
            },
          }
        );

        console.log(
          '[/google/callback] Userinfo response status:',
          response.status
        );

        if (!response.ok) {
          console.log('[/google/callback] Failed to fetch userinfo');
          return c.redirect('/login?error=failed_to_fetch_user');
        }

        const googleUser = (await response.json()) as any;
        console.log(
          '[/google/callback] Google user retrieved:',
          googleUser.email
        );

        // Extract essentials with safe fallbacks
        const googleId: string | undefined = googleUser?.id || googleUser?.sub; // some endpoints return 'sub'
        const email: string | undefined = googleUser?.email;
        let name: string | undefined =
          googleUser?.name ||
          [googleUser?.given_name, googleUser?.family_name]
            .filter(Boolean)
            .join(' ');

        if (!name && email) {
          name = email.split('@')[0];
        }

        if (!googleId) {
          console.log('[/google/callback] Missing googleId');
          return c.redirect(
            '/login?error=oauth_failed&reason=missing_google_id'
          );
        }
        if (!email) {
          console.log('[/google/callback] Missing email');
          return c.redirect(
            '/login?error=oauth_failed&reason=missing_email_scope'
          );
        }
        if (!name) {
          name = 'User';
        }

        console.log('[/google/callback] Calling GoogleLogin with:', {
          googleId,
          email,
          name,
        });

        // Login or create user
        const result = await this.authService.GoogleLogin(
          googleId,
          email,
          name
        );
        console.log(
          '[/google/callback] GoogleLogin succeeded for user:',
          result.id
        );

        // Set auth cookies
        this.setAuthCookies(c, result.accessToken, result.refreshToken);
        console.log('[/google/callback] Auth cookies set');

        // Clear OAuth cookies
        deleteCookie(c, 'google_oauth_state', { path: '/' });
        deleteCookie(c, 'google_code_verifier', { path: '/' });

        console.log(
          '[/google/callback] OAuth successful for user:',
          result.email,
          'redirecting to /dashboard'
        );
        // Normal redirect; dashboard guard will tolerate initial cookie propagation delay
        return c.redirect('/dashboard', 303);
      } catch (err) {
        console.error('Google OAuth callback error:', err);
        const reason = encodeURIComponent((err as Error)?.message || 'unknown');
        return c.redirect(`/login?error=oauth_failed&reason=${reason}`);
      }
    });
  }

  // Helper: Set auth cookies with explicit domain/port handling
  private setAuthCookies(
    c: Context,
    accessToken: string,
    refreshToken: string
  ) {
    const isProduction = process.env.NODE_ENV === 'production';

    // Access token cookie (15 minutes)
    setCookie(c, 'accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'Lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    });

    console.log('[setAuthCookies] Set accessToken cookie');

    // Refresh token cookie (7 days)
    setCookie(c, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('[setAuthCookies] Set refreshToken cookie');
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
