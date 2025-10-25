# Facebook OAuth Setup Guide

This guide will walk you through setting up Facebook OAuth to allow users to connect their Facebook Pages to Cogmatt.

## Prerequisites

- A Facebook account
- Admin access to at least one Facebook Page

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** in the top right
3. Click **"Create App"**
4. Choose **"Business"** as the app type
5. Fill in the details:
   - **App Name**: Cogmatt (or your preferred name)
   - **App Contact Email**: Your email
   - **Business Account**: Select or create one
6. Click **"Create App"**

## Step 2: Add Facebook Login Product

1. In your app dashboard, find **"Facebook Login"** in the products list
2. Click **"Set Up"** on Facebook Login
3. Choose **"Web"** as the platform
4. Enter your site URL: `http://localhost:3000` (for development)

## Step 3: Configure OAuth Settings

1. In the left sidebar, click **"Facebook Login"** → **"Settings"**
2. Add the following to **Valid OAuth Redirect URIs**:
   ```
   http://localhost:3000/api/social-accounts/facebook/callback
   ```
3. For production, add:
   ```
   https://yourdomain.com/api/social-accounts/facebook/callback
   ```
4. Click **"Save Changes"**

## Step 4: Add Required Permissions

1. In the left sidebar, go to **"App Review"** → **"Permissions and Features"**
2. Request the following permissions:
   - `pages_show_list` - Get list of Pages
   - `pages_read_engagement` - Read Page engagement data
   - `pages_manage_posts` - Create and manage Page posts
   - `pages_manage_engagement` - Manage Page comments/messages
   - `instagram_basic` - Basic Instagram data
   - `instagram_content_publish` - Publish to Instagram

**Note**: Some permissions require app review by Facebook. For development/testing, these permissions work with Pages you admin.

## Step 5: Get App Credentials

1. In the left sidebar, click **"Settings"** → **"Basic"**
2. Copy the **App ID**
3. Click **"Show"** next to **App Secret** and copy it
4. Add these to your `.env` file:

```bash
FACEBOOK_APP_ID=your-app-id-here
FACEBOOK_APP_SECRET=your-app-secret-here
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/social-accounts/facebook/callback
```

## Step 6: Test the Integration

1. Make sure your dev server is running
2. Navigate to `/dashboard/accounts` in your app
3. Click **"Connect Facebook Page"**
4. Log in with your Facebook account
5. Select which Page(s) to grant access to
6. Choose a page from the list
7. The page should now appear in your connected accounts!

## Step 7: Production Setup

Before going to production:

1. **Update App Mode**:
   - Switch your Facebook App from "Development" to "Live" mode
   - In **Settings** → **Basic**, toggle the app mode

2. **Complete App Review**:
   - Submit your app for review if you need advanced permissions
   - Provide use case explanations and demo videos

3. **Update Environment Variables**:
   - Use production Facebook App credentials
   - Update `FACEBOOK_REDIRECT_URI` to your production domain

4. **Configure App Domains**:
   - In **Settings** → **Basic**, add your production domain to **App Domains**

## Troubleshooting

### "Redirect URI Mismatch" Error

- Make sure the redirect URI in your `.env` matches exactly what's in Facebook settings
- Check for trailing slashes - they matter!

### "App Not Set Up" Error

- Ensure Facebook Login product is added to your app
- Verify OAuth redirect URIs are configured

### Can't See My Pages

- You must be an admin of the page
- The app must have `pages_show_list` permission
- Try logging out and reconnecting

### Token Expires Immediately

- Page access tokens are long-lived by default
- User access tokens expire in 1-2 hours
- We request Page tokens specifically, which don't expire

## Security Best Practices

1. **Never commit** `.env` files with real credentials
2. **Rotate secrets** regularly in production
3. **Use HTTPS** in production
4. **Validate state parameter** (already implemented)
5. **Store tokens encrypted** in production databases

## Resources

- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/web)
- [Pages API Documentation](https://developers.facebook.com/docs/pages)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [App Review Process](https://developers.facebook.com/docs/app-review)
