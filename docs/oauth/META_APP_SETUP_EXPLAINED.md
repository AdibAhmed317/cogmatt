# Meta App Setup - Complete Guide for Beginners

## What is a Meta (Facebook) App?

A Meta app is like a "bridge" that connects your Cogmatt application to Facebook's systems. It's NOT an app that users install—it's a configuration that tells Facebook: "This website (Cogmatt) is allowed to access Facebook data and post on behalf of users."

---

## Why Do You Need It?

Without a Meta app, you can't:

- Let users log in with Facebook
- Access their Facebook Pages
- Post content to their Pages
- Get analytics from Facebook

**Think of it as getting permission from Facebook to integrate with their platform.**

---

## Step-by-Step Setup

### 1. Create Meta Developer Account

1. Go to: https://developers.facebook.com/
2. Click **"Get Started"** (top right)
3. Log in with your Facebook account
4. Complete the registration (name, email verification)

---

### 2. Create a New App

1. Click **"My Apps"** → **"Create App"**
2. Choose app type: **"Business"** (for posting to pages)
3. Fill in details:
   - **App Name**: Cogmatt (or whatever you want)
   - **App Contact Email**: Your email
   - **Business Account**: Skip for now (optional)
4. Click **"Create App"**

---

### 3. Add Facebook Login Product

1. In your app dashboard, find **"Add Products"** section
2. Find **"Facebook Login"** → Click **"Set Up"**
3. Choose platform: **"Web"**
4. You'll see a setup guide—skip it for now

---

### 4. Configure Facebook Login Settings

1. Go to **"Facebook Login" → "Settings"** (left sidebar)
2. Find **"Valid OAuth Redirect URIs"**
3. Add these URLs:

   ```
   http://localhost:3000/api/social-accounts/facebook/callback
   https://yourdomain.com/api/social-accounts/facebook/callback
   ```

   **What is this?** After users log in with Facebook, Facebook redirects them back to your app. This URL is where they land.

4. Save changes

---

### 5. Get Your App Credentials

1. Go to **"Settings" → "Basic"** (left sidebar)
2. You'll see:
   - **App ID**: Copy this
   - **App Secret**: Click "Show" → Copy this

**IMPORTANT**: Keep App Secret private! Never share it or commit to Git.

---

### 6. Add Required Permissions

1. Go to **"App Review" → "Permissions and Features"**
2. Request these permissions:
   - `pages_show_list` - See list of pages user manages
   - `pages_read_engagement` - Read page data
   - `pages_manage_posts` - Publish posts to pages

**For Development**: You can use these immediately  
**For Production**: Need to submit for Facebook review

---

### 7. Configure Your .env File

Create/update `.env` in your project root:

```env
# Facebook OAuth
FACEBOOK_APP_ID=your-app-id-here
FACEBOOK_APP_SECRET=your-app-secret-here
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/social-accounts/facebook/callback
```

**Replace `your-app-id-here` and `your-app-secret-here` with the values from Step 5.**

---

## Understanding the Flow

### What Happens When User Clicks "Connect Facebook"?

```
1. User clicks "Connect" in Settings
   ↓
2. Frontend calls: /api/social-accounts/facebook/auth
   ↓
3. Backend generates Facebook login URL with your App ID
   ↓
4. User redirected to Facebook (pop-up window)
   ↓
5. User logs in & grants permissions
   ↓
6. Facebook redirects to: /api/social-accounts/facebook/callback
   ↓
7. Backend receives "code" from Facebook
   ↓
8. Backend exchanges code for access_token
   ↓
9. Backend fetches user's Facebook Pages
   ↓
10. Frontend shows page selector
    ↓
11. User selects a page
    ↓
12. Backend stores page access_token in database
    ↓
13. Done! User can now post to that page
```

---

## Key Concepts Explained

### Access Token

- **What**: A secret key that proves you have permission
- **Why**: Needed to make API calls to Facebook
- **Lifetime**: Short-lived (1-2 hours) OR long-lived (60 days)
- **Storage**: Saved in your database (`socialAccounts.accessToken`)

### Page Access Token

- **What**: Special token for a specific Facebook Page
- **Why**: Different from user token—specifically for posting to pages
- **Lifetime**: Never expires (for pages you manage)
- **How**: Obtained when user selects a page

### OAuth (Open Authorization)

- **What**: Industry standard for authorization
- **Why**: Secure way to access user data without passwords
- **How**: Uses temporary codes exchanged for tokens

### Permissions (Scopes)

- **What**: Specific things your app can do
- **Why**: Facebook limits what apps can access
- **Examples**:
  - `pages_show_list` = See pages
  - `pages_manage_posts` = Post to pages

---

## Testing Your Setup

### 1. Start Your Dev Server

```bash
bun run dev
```

### 2. Navigate to Settings

```
http://localhost:3000/dashboard/settings
```

### 3. Click "Connect Facebook"

- Should open Facebook login popup
- Log in with your Facebook account
- Grant permissions

### 4. Select a Page

- You should see pages you manage
- Select one
- Should appear as "Connected"

---

## Common Issues & Solutions

### Issue: "Invalid OAuth Redirect URI"

**Solution**: Check `FACEBOOK_REDIRECT_URI` in `.env` matches exactly what's in Facebook App Settings

### Issue: "App Not Set Up"

**Solution**: Make sure you added Facebook Login product

### Issue: "Access Denied"

**Solution**: Check you have pages_manage_posts permission in App Review

### Issue: No pages showing up

**Solution**: Make sure you're logged into Facebook account that manages pages

### Issue: "This app is in development mode"

**Solution**: Normal! Add yourself as a test user in Roles → Test Users

---

## Development vs Production

### Development Mode (Current)

- Only you and test users can use it
- All permissions available
- Use localhost URLs
- No review needed

### Production Mode (Later)

- Anyone can use it
- Need Facebook review for advanced permissions
- Use HTTPS URLs
- Must pass compliance checks

---

## What Files in Your Project Handle This?

```
src/application/services/SocialAccountService.ts
├─ generateFacebookAuthUrl() → Creates login URL
├─ exchangeCodeForToken() → Gets access token
├─ getFacebookPages() → Fetches user's pages
└─ saveFacebookPage() → Stores page token

src/presentation/controllers/SocialAccountController.ts
├─ /facebook/auth → Starts OAuth flow
├─ /facebook/callback → Receives OAuth response
└─ /facebook/connect-page → Saves selected page

src/components/dashboard/pages/SettingsPage.tsx
├─ handleConnectFacebook() → Opens OAuth popup
└─ handleSelectPage() → Saves selected page

src/infrastructure/database/schema.ts
└─ socialAccounts table → Stores tokens
```

---

## Next Steps: Posting to Facebook

Once you have a connected page, you can post using:

```typescript
// Facebook Graph API
const pageAccessToken = account.accessToken;

const response = await fetch(
  `https://graph.facebook.com/v18.0/${pageId}/feed`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Your post content here',
      access_token: pageAccessToken,
    }),
  }
);
```

This should be implemented in your PostComposer or PostService.

---

## Security Best Practices

✅ **DO**:

- Keep App Secret in `.env` (never commit)
- Use HTTPS in production
- Validate state parameter (CSRF protection)
- Store tokens encrypted in database (consider this)
- Rotate secrets periodically

❌ **DON'T**:

- Expose App Secret in frontend code
- Commit `.env` to Git
- Store tokens in localStorage
- Share App Secret publicly

---

## Resources

- **Meta for Developers**: https://developers.facebook.com/
- **Graph API Explorer**: https://developers.facebook.com/tools/explorer/
- **Page Publishing Docs**: https://developers.facebook.com/docs/pages/publishing/
- **Your App Dashboard**: https://developers.facebook.com/apps/

---

## Quick Reference Card

| What         | Where            | Why                             |
| ------------ | ---------------- | ------------------------------- |
| App ID       | Settings → Basic | Identifies your app             |
| App Secret   | Settings → Basic | Proves it's your app            |
| Redirect URI | Login Settings   | Where Facebook sends users back |
| Permissions  | App Review       | What your app can do            |
| Access Token | In your database | Proves user gave permission     |
| Page Token   | In your database | Proves you can post to page     |

---

## Summary

You're creating a Meta app to:

1. **Authenticate users** via Facebook OAuth
2. **Access their Facebook Pages** they manage
3. **Get page tokens** to post on their behalf
4. **Store tokens** securely in your database
5. **Make posts** from Cogmatt to their Facebook Pages

Your code already handles all of this! You just need to:

1. Create the Meta app
2. Get App ID & Secret
3. Add them to `.env`
4. Test the connection

That's it! 🚀
