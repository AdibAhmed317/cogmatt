# Facebook OAuth — Setup & Integration Summary

This document consolidates Facebook Page OAuth setup and the integration summary.

## Overview

Facebook OAuth allows connecting Facebook Pages (and Instagram Business via Graph API) so Cogmatt can manage and post content on behalf of pages.

## Setup (Facebook Developers)

1. Create an app at https://developers.facebook.com/ → My Apps → Create App (Business).
2. Add the Facebook Login product and choose Web as the platform.
3. Configure Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/social-accounts/facebook/callback`
4. Copy App ID and App Secret and add to `.env`:

```env
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/social-accounts/facebook/callback
```

## Permissions Often Required

- pages_show_list
- pages_read_engagement
- pages_manage_posts
- pages_manage_engagement
- instagram_basic
- instagram_content_publish

Note: Some permissions require Facebook App Review for production.

## Integration Flow (Summary)

1. Frontend requests an auth URL from backend and opens a popup for Facebook OAuth.
2. User authorizes and selects Pages to grant access to.
3. Facebook redirects to backend callback; backend validates state, exchanges code for user token, then fetches pages and page tokens.
4. User selects a Page in the frontend; backend stores long-lived page access token in the DB (securely).
5. Page appears in connected accounts; tokens can be used to post or schedule content.

## Backend Components

- Entities: `SocialAccountEntity`, `PlatformEntity`.
- Repository: `SocialAccountRepository` for CRUD.
- Service: `SocialAccountService` to interact with Facebook Graph API.
- Controller routes: `/api/social-accounts/facebook/auth`, `/api/social-accounts/facebook/callback`, `/api/social-accounts/facebook/connect-page`.

## Testing

1. Run dev server.
2. Navigate to `/dashboard/accounts` and click "Connect Facebook Page".
3. Authorize and select a page; verify it appears in connected accounts.

## Security & Best Practices

- Never commit `.env` with secrets.
- Validate state to protect against CSRF.
- Use HTTPS in production and rotate secrets periodically.
