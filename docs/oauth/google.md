# Google OAuth — Overview, Setup & Implementation

This single document consolidates the previous Google OAuth guides and implementation notes.

## Overview

Google OAuth has been integrated to provide users with an alternative to email/password authentication. Key features:

- Dual auth: Google OAuth and email/password
- Smart account linking when emails match
- OAuth-only users may have nullable passwords and can set a password later
- Security: CSRF state validation, PKCE, httpOnly cookies, bcrypt for passwords, JWT tokens

## Setup (Google Cloud)

1. Go to Google Cloud Console and create/select a project.
2. Enable the Google APIs you need (OAuth consent requires minimal scopes).
3. Configure the OAuth consent screen (External for most apps).
4. Create OAuth 2.0 credentials → Web application.
   - Authorized JS origins: `http://localhost:3000`
   - Redirect URI: `http://localhost:3000/api/auth/google/callback`
5. Copy Client ID and Client Secret and add to your `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

## How It Works (Implementation Summary)

- Frontend triggers `/api/auth/google` which generates a state token and PKCE verifier, stores them in a cookie, and redirects to Google's consent screen.
- Google redirects back to `/api/auth/google/callback?code=...&state=...`.
- Backend verifies state (CSRF), exchanges code for tokens, fetches the user's profile, and then:
  - If a user exists with the Google ID: log them in.
  - Else if a user exists with the same email: link Google account to existing user.
  - Else: create a new user with `authProvider='google'`, `password=null`, `emailVerified=true`.
- Generate JWT access & refresh tokens and set httpOnly cookies.

## Files & Code Notes

- DB/Schema: `googleId` field, `authProvider`, `password` nullable.
- Repository: `FindByGoogleId`, `FindOrCreateGoogleUser`, `UpdatePassword`.
- Service: `GoogleLogin(userInfo)`, `SetPassword(userId, newPassword)`.
- Controller endpoints:
  - `GET /api/auth/google` — start flow
  - `GET /api/auth/google/callback` — handle callback

## Testing

1. Start dev server: `bun run dev`
2. Visit `/login` and click "Continue with Google"
3. Authorize and verify you are redirected to the dashboard

## Troubleshooting

- redirect_uri_mismatch: ensure redirect URI in Google Console matches `.env` exactly.
- invalid_oauth_state: cookies/state mismatch — try again and check cookie settings.
- Access blocked: confirm OAuth consent and APIs are enabled.

## Optional Enhancements

- Allow Google users to set a password in Settings (endpoint: `POST /api/auth/set-password`).
- Add email verification flows for credential-based signups.
- Add other providers (GitHub, Twitter/X) following the same pattern.
