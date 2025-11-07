# Missing Features for Complete Facebook Posting

## ✅ What You Have (Already Implemented)

### 1. Facebook OAuth Connection

- ✅ Generate Facebook auth URL
- ✅ Handle OAuth callback
- ✅ Exchange code for token
- ✅ Fetch user's Facebook Pages
- ✅ Store page access tokens in database
- ✅ UI for connecting/disconnecting accounts

### 2. Database Schema

- ✅ `socialAccounts` table for storing tokens
- ✅ `platforms` table for Facebook metadata
- ✅ `posts` table (exists in schema)
- ✅ Proper relationships and foreign keys

### 3. UI Components

- ✅ Settings page with "Connect Facebook" button
- ✅ Page selector modal
- ✅ Connected accounts display
- ✅ Post composer with draft saving and hashtag generation

---

## ❌ What's Missing

### 1. **Actual Facebook Posting Logic** ⚠️ CRITICAL

Currently, `PostComposer.tsx` only saves drafts locally. It doesn't actually publish to Facebook.

**What you need:**

- API endpoint to create posts: `POST /api/posts`
- Service to call Facebook Graph API
- Logic to select which connected account(s) to post to

**Files to create/modify:**

```
src/application/services/PostService.ts          [CREATE]
src/infrastructure/repositories/PostRepository.ts [CREATE]
src/presentation/controllers/PostController.ts    [CREATE]
src/routes/api/posts.ts                          [CREATE]
```

---

### 2. **Post Scheduling**

Your schema has a `scheduledFor` field, but no logic to handle scheduled posts.

**What you need:**

- Background job system (e.g., BullMQ, node-cron)
- Worker to check for scheduled posts
- Logic to publish at scheduled time

---

### 3. **Multi-Account Selection**

Users should be able to select which Facebook page(s) to post to.

**What you need:**

- Checkbox list of connected accounts in PostComposer
- Logic to post to multiple pages simultaneously
- Error handling for failed posts to specific accounts

---

### 4. **Media Upload**

Currently, you can only post text. No images/videos.

**What you need:**

- File upload component
- Upload to Facebook (using Graph API)
- Support for multiple images
- Video upload handling

---

### 5. **Post Preview**

No way to see how the post will look before publishing.

**What you need:**

- Preview component mimicking Facebook's UI
- Character count validation
- Link preview generation

---

### 6. **Analytics Integration**

Schema has analytics tables, but no implementation.

**What you need:**

- Fetch post insights from Facebook Graph API
- Store analytics data
- Display charts in AnalyticsPage

---

## 🚀 Priority Implementation Order

### Phase 1: Basic Posting (DO THIS FIRST)

1. **Create PostService** - Handle Facebook API calls
2. **Create PostController** - API endpoints
3. **Update PostComposer** - Add "Publish" button with account selector
4. **Test end-to-end** - Connect account → Create post → Publish to Facebook

### Phase 2: Enhanced Features

5. **Add media upload** - Images and videos
6. **Add scheduling** - Background jobs
7. **Add post preview** - Before publishing

### Phase 3: Advanced Features

8. **Multi-account posting** - Post to multiple pages
9. **Analytics** - Fetch and display insights
10. **Post editing** - Edit scheduled/published posts

---

## 📝 Quick Implementation Guide

### Step 1: Create PostService

Create `src/application/services/PostService.ts`:

```typescript
export class PostService {
  async publishToFacebook(
    pageId: string,
    accessToken: string,
    message: string,
    mediaUrls?: string[]
  ): Promise<{ postId: string }> {
    // Call Facebook Graph API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          access_token: accessToken,
          // Add media if provided
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to publish to Facebook');
    }

    const data = await response.json();
    return { postId: data.id };
  }
}
```

### Step 2: Create API Route

Create `src/routes/api/posts.ts`:

```typescript
export const Route = createFileRoute('/api/posts/$' as any)({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Parse request body (message, socialAccountIds)
        // 2. For each social account:
        //    - Get account from database
        //    - Call PostService.publishToFacebook()
        //    - Save post record to database
        // 3. Return success response
      },
    },
  },
});
```

### Step 3: Update PostComposer

Add account selector and publish button:

```tsx
function PostComposer() {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  // Fetch connected accounts
  useEffect(() => {
    fetch('/api/social-accounts/[agencyId]')
      .then((res) => res.json())
      .then(setConnectedAccounts);
  }, []);

  async function handlePublish() {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: content,
        socialAccountIds: selectedAccounts,
      }),
    });

    if (response.ok) {
      alert('Posted successfully!');
      clearDraft();
    }
  }

  return (
    <div>
      {/* Existing composer UI */}

      {/* Add account selector */}
      <div>
        <h4>Post to:</h4>
        {connectedAccounts.map((account) => (
          <label key={account.id}>
            <input
              type='checkbox'
              checked={selectedAccounts.includes(account.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedAccounts([...selectedAccounts, account.id]);
                } else {
                  setSelectedAccounts(
                    selectedAccounts.filter((id) => id !== account.id)
                  );
                }
              }}
            />
            {account.platformName} - {account.username}
          </label>
        ))}
      </div>

      {/* Add publish button */}
      <button onClick={handlePublish}>Publish Now</button>
    </div>
  );
}
```

---

## 🔍 Testing Checklist

- [ ] Connect Facebook account in Settings
- [ ] Account appears in connected accounts list
- [ ] Select account in PostComposer
- [ ] Write a test message
- [ ] Click "Publish"
- [ ] Post appears on Facebook Page
- [ ] Post record saved in database
- [ ] Success message shown in UI

---

## 📚 Resources

### Facebook Graph API Documentation

- **Publishing**: https://developers.facebook.com/docs/pages/publishing
- **Photo Posts**: https://developers.facebook.com/docs/graph-api/reference/page/photos/
- **Video Posts**: https://developers.facebook.com/docs/graph-api/reference/page/videos/

### Example API Calls

**Text Post:**

```bash
POST https://graph.facebook.com/v18.0/{page-id}/feed
{
  "message": "Hello World!",
  "access_token": "{page-access-token}"
}
```

**Photo Post:**

```bash
POST https://graph.facebook.com/v18.0/{page-id}/photos
{
  "url": "https://example.com/image.jpg",
  "caption": "Check out this image!",
  "access_token": "{page-access-token}"
}
```

---

## Summary

**Your project structure is PERFECT for what you're trying to achieve!**

You have:

- ✅ OAuth flow implemented
- ✅ Token storage working
- ✅ UI components ready

You're missing:

- ❌ The actual posting logic (Facebook Graph API calls)
- ❌ Account selection in PostComposer
- ❌ API endpoint to handle post creation

**Next step**: Implement the PostService and update PostComposer to actually call Facebook's API. Everything else is already in place!
