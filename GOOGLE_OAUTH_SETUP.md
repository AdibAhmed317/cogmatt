# Google OAuth Setup Guide

This guide explains how to set up Google OAuth authentication for Cogmatt.

## Features

- **Dual Authentication**: Users can sign up/login with either Google OAuth or email/password
- **Smart Account Linking**: If a user signs up with Google using an email that already exists, the accounts are automatically linked
- **Password Management**:
  - Users who register with Google won't have a password initially
  - If they try to login with credentials, they'll see: "Password not set. Please login with Google or set a password in settings."
  - Users can set a password later in settings to enable credential-based login
- **Automatic Email Verification**: Google OAuth users are automatically marked as email verified

## How to Get Google OAuth Credentials

### 1. Go to Google Cloud Console

Visit [Google Cloud Console](https://console.cloud.google.com/)

### 2. Create a New Project (or select existing)

- Click on the project dropdown at the top
- Click "New Project"
- Enter a project name (e.g., "Cogmatt")
- Click "Create"

### 3. Enable Google+ API

- In the left sidebar, go to "APIs & Services" > "Library"
- Search for "Google+ API"
- Click on it and press "Enable"

### 4. Configure OAuth Consent Screen

- Go to "APIs & Services" > "OAuth consent screen"
- Choose "External" (unless you have a Google Workspace)
- Click "Create"
- Fill in the required information:
  - App name: Cogmatt
  - User support email: your email
  - Developer contact email: your email
- Click "Save and Continue"
- Skip the scopes section (click "Save and Continue")
- Add test users if needed (in development)
- Click "Save and Continue"

### 5. Create OAuth 2.0 Credentials

- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth client ID"
- Choose "Web application"
- Configure:
  - Name: Cogmatt Web Client
  - Authorized JavaScript origins:
    - `http://localhost:3000` (for development)
    - `https://yourdomain.com` (for production)
  - Authorized redirect URIs:
    - `http://localhost:3000/api/auth/google/callback` (for development)
    - `https://yourdomain.com/api/auth/google/callback` (for production)
- Click "Create"

### 6. Copy Your Credentials

- You'll see a popup with your Client ID and Client Secret
- Copy these values

### 7. Add to Environment Variables

Create or update your `.env` file:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

For production, update the redirect URI:

```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

## Authentication Flow

### Sign Up/Login with Google

1. User clicks "Continue with Google" or "Sign up with Google"
2. User is redirected to Google's consent screen
3. After approval, Google redirects back to `/api/auth/google/callback`
4. Backend exchanges code for user info
5. Backend either:
   - Creates new user if email doesn't exist
   - Links Google to existing account if email exists
   - Logs in existing Google user
6. User is redirected to dashboard with auth cookies set

### Sign Up/Login with Credentials

1. User enters email and password
2. Backend validates credentials
3. If user registered with Google and no password is set:
   - Error: "Password not set. Please login with Google or set a password in settings."
4. Otherwise, normal authentication flow

## Database Schema

The users table includes:

- `password`: Nullable (for OAuth-only users)
- `googleId`: Unique identifier from Google
- `authProvider`: 'credentials' | 'google' (tracks primary auth method)
- `emailVerified`: Automatically true for Google users

## Security Notes

- OAuth state parameter prevents CSRF attacks
- PKCE (code verifier) adds extra security
- Cookies are httpOnly to prevent XSS
- Passwords are hashed with bcrypt
- JWT tokens for session management

## Testing

1. Start your dev server: `bun run dev`
2. Navigate to `/login` or `/signup`
3. Click "Continue with Google"
4. Authorize with a Google account
5. You should be redirected to the dashboard

## Troubleshooting

### "redirect_uri_mismatch" error

- Make sure your redirect URI in Google Console exactly matches the one in your `.env`
- Include the protocol (http/https), port, and full path

### "Access blocked: This app's request is invalid"

- Make sure you've enabled the Google+ API
- Check your OAuth consent screen is configured

### User can't login with credentials after signing up with Google

- This is expected! Users need to set a password in settings first
- They'll see: "Password not set. Please login with Google or set a password in settings."

### Accounts aren't linking

- Check that the `FindOrCreateGoogleUser` method is properly handling existing emails
- Verify the email from Google matches the existing account email

## Future Enhancements

To allow users to set passwords in settings, add:

1. A "Set Password" form in the Settings page
2. Call the `/api/auth/set-password` endpoint (needs to be created)
3. Use `authService.SetPassword(userId, newPassword)` to update

Example endpoint:

```typescript
this.router.post('/set-password', async (c) => {
  const accessToken = getCookie(c, 'accessToken');
  const payload = this.authService.verifyAccessToken(accessToken);
  const { newPassword } = await c.req.json();
  await this.authService.SetPassword(payload.userId, newPassword);
  return c.json({ message: 'Password set successfully' });
});
```
