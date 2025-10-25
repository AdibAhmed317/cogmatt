# Authentication Flow Diagram

## Complete Authentication System

Your Cogmatt application now supports two authentication methods:

```
┌─────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION                       │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
         ┌──────▼──────┐         ┌─────▼──────┐
         │   GOOGLE    │         │   EMAIL/   │
         │   OAUTH     │         │  PASSWORD  │
         └──────┬──────┘         └─────┬──────┘
                │                      │
                │                      │
┌───────────────▼──────────────────────▼───────────────┐
│              USER REGISTRATION FLOW                   │
└──────────────────────────────────────────────────────┘
```

## Flow 1: Google OAuth Registration/Login

```
User clicks "Continue with Google"
        │
        ▼
Redirect to /api/auth/google
        │
        ▼
Generate state & code verifier
Store in cookies
        │
        ▼
Redirect to Google consent screen
        │
        ▼
User authorizes on Google
        │
        ▼
Google redirects to /api/auth/google/callback?code=xxx&state=xxx
        │
        ▼
Verify state (CSRF protection)
        │
        ▼
Exchange code for access token
        │
        ▼
Fetch user info from Google API
        │
        ▼
Check if user exists by Google ID
        │
        ├─── YES → Login user
        │
        └─── NO → Check if email exists
                      │
                      ├─── YES → Link Google to existing account
                      │          Update: googleId, authProvider, emailVerified
                      │          Login user
                      │
                      └─── NO → Create new user
                                 Fields: name, email, googleId
                                 authProvider='google'
                                 password=null
                                 emailVerified=true
                                 Login user
        │
        ▼
Generate JWT tokens (access & refresh)
        │
        ▼
Set httpOnly cookies
        │
        ▼
Redirect to /dashboard
```

## Flow 2: Email/Password Registration

```
User enters name, email, password
        │
        ▼
POST /api/auth/register
        │
        ▼
Check if email exists
        │
        ├─── YES → Return error
        │
        └─── NO → Continue
                      │
                      ▼
                Hash password with bcrypt
                      │
                      ▼
                Create new user
                Fields: name, email, password (hashed)
                authProvider='credentials'
                emailVerified=false
                      │
                      ▼
                Generate JWT tokens
                      │
                      ▼
                Set httpOnly cookies
                      │
                      ▼
                Redirect to /dashboard
```

## Flow 3: Email/Password Login

```
User enters email, password
        │
        ▼
POST /api/auth/login
        │
        ▼
Find user by email
        │
        ├─── NOT FOUND → Return error
        │
        └─── FOUND → Continue
                      │
                      ▼
                Check if user has password
                      │
                      ├─── NO PASSWORD & authProvider='google'
                      │    → Return: "Password not set. Please login
                      │       with Google or set a password in settings."
                      │
                      ├─── NO PASSWORD
                      │    → Return: "Password not set. Please set a
                      │       password in settings."
                      │
                      └─── HAS PASSWORD → Continue
                                  │
                                  ▼
                            Verify password with bcrypt
                                  │
                                  ├─── INVALID → Return error
                                  │
                                  └─── VALID → Continue
                                            │
                                            ▼
                                      Generate JWT tokens
                                            │
                                            ▼
                                      Set httpOnly cookies
                                            │
                                            ▼
                                      Return success
```

## Flow 4: Set Password (Future Feature)

```
Google user wants to enable credential login
        │
        ▼
Navigate to Settings
        │
        ▼
Enter new password
        │
        ▼
POST /api/auth/set-password
        │
        ▼
Verify access token
        │
        ▼
Hash new password with bcrypt
        │
        ▼
Update user.password
        │
        ▼
User can now login with both Google AND credentials
```

## Database Schema

```sql
users
├── id (uuid, primary key)
├── name (text, not null)
├── email (text, unique, not null)
├── password (text, nullable) ← Can be null for OAuth users
├── googleId (text, unique, nullable) ← Google user identifier
├── authProvider (text, default 'credentials') ← 'google' | 'credentials'
├── role (text, default 'user')
├── emailVerified (boolean, default false) ← Auto true for Google
├── createdAt (timestamp)
└── updatedAt (timestamp)
```

## Security Features

### 1. CSRF Protection

- State parameter in OAuth flow
- Verified on callback to prevent attacks

### 2. PKCE Flow

- Code verifier generated for each OAuth flow
- Prevents authorization code interception

### 3. Secure Cookies

```typescript
httpOnly: true,     // JavaScript cannot access
secure: production, // HTTPS only in production
sameSite: 'Lax',   // CSRF protection
maxAge: 900,       // 15 minutes for access token
```

### 4. Password Security

- Bcrypt hashing (cost factor 10)
- Never stored in plain text
- Nullable for OAuth-only users

### 5. JWT Tokens

- Access token: 15 minutes expiry
- Refresh token: 7 days expiry
- Stored in database for revocation

## Error Handling

### Login Errors

| Error Message                                   | Meaning                     | Solution                         |
| ----------------------------------------------- | --------------------------- | -------------------------------- |
| "Invalid email or password"                     | Credentials don't match     | Check email/password             |
| "Password not set. Please login with Google..." | User registered with Google | Use Google login or set password |
| "User with this email already exists"           | Email taken during signup   | Use login instead                |

### OAuth Errors

| Error                 | Meaning                                   | Solution                         |
| --------------------- | ----------------------------------------- | -------------------------------- |
| redirect_uri_mismatch | Redirect URI doesn't match Google Console | Update Google Console settings   |
| invalid_oauth_state   | CSRF attack or cookie issue               | Try again, check cookies enabled |
| oauth_failed          | General OAuth error                       | Check credentials, try again     |

## Testing Checklist

- [ ] New user signs up with Google
- [ ] Existing email user links Google account
- [ ] Google user logs in with Google
- [ ] New user signs up with email/password
- [ ] User logs in with email/password
- [ ] Google user tries to login with credentials (sees error)
- [ ] User logs out and cookies are cleared
- [ ] Token refresh works correctly
- [ ] Access token expires and refreshes
- [ ] OAuth state validation prevents CSRF

## API Endpoints

| Method | Endpoint                  | Purpose                           |
| ------ | ------------------------- | --------------------------------- |
| POST   | /api/auth/register        | Email/password signup             |
| POST   | /api/auth/login           | Email/password login              |
| GET    | /api/auth/google          | Initiate Google OAuth             |
| GET    | /api/auth/google/callback | Handle Google callback            |
| POST   | /api/auth/refresh         | Refresh access token              |
| POST   | /api/auth/logout          | Logout (invalidate refresh token) |
| GET    | /api/auth/me              | Get current user info             |

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Environment
NODE_ENV=development
```

## Next Steps

1. ✅ Get Google OAuth credentials (see GOOGLE_OAUTH_SETUP.md)
2. ✅ Add credentials to .env file
3. ✅ Test Google login flow
4. ⏳ Optional: Implement "Set Password" in Settings page
5. ⏳ Optional: Add email verification for credential signups
6. ⏳ Optional: Add "Forgot Password" flow
7. ⏳ Optional: Add GitHub OAuth (similar pattern)

## Support

All implementation details are in:

- `GOOGLE_OAUTH_SETUP.md` - Setup instructions
- `GOOGLE_OAUTH_IMPLEMENTATION.md` - Implementation summary
- This file - Flow diagrams and reference
