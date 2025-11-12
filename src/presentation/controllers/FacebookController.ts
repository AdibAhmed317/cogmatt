import { Hono } from 'hono';
import { FacebookService } from '@/application/services/FacebookService';

export class FacebookController {
  public router: Hono;

  constructor() {
    this.router = new Hono();
    this.initRoutes();
  }

  private initRoutes() {
    // Debug endpoint to check accounts
    this.router.get('/debug/:agencyId', async (c) => {
      try {
        const agencyId = c.req.param('agencyId');
        const accountsRes = await fetch(
          `http://localhost:3000/api/social-accounts/${agencyId}`
        );
        const accounts = await accountsRes.json();

        return c.json({
          accounts,
          facebookAccounts: accounts.filter(
            (acc: any) => acc.platformName === 'Facebook'
          ),
        });
      } catch (error: any) {
        return c.json({ error: error.message }, 500);
      }
    });

    // Test Facebook API directly
    this.router.get('/test-fb/:agencyId', async (c) => {
      try {
        const agencyId = c.req.param('agencyId');
        const accountsRes = await fetch(
          `http://localhost:3000/api/social-accounts/${agencyId}`
        );
        const accounts = await accountsRes.json();
        const fbAccount = accounts.find(
          (acc: any) => acc.platformName === 'Facebook' && acc.accountId
        );

        if (!fbAccount) {
          return c.json({ error: 'No Facebook page found' }, 404);
        }

        // Get the actual token from database using the service
        const accountService = await import(
          '@/application/services/SocialAccountService'
        );
        const socialAccountRepo = await import(
          '@/infrastructure/repositories/SocialAccountRepository'
        );
        const service = new accountService.SocialAccountService(
          new socialAccountRepo.SocialAccountRepository()
        );
        const connectedAccounts = await service.getConnectedAccounts(agencyId);
        const fullAccount = connectedAccounts.find(
          (acc) => acc.accountId === fbAccount.accountId
        );

        // Try to fetch posts directly from Facebook
        const fbResponse = await fetch(
          `https://graph.facebook.com/v21.0/${fbAccount.accountId}/posts?fields=id,message,created_time,reactions.summary(total_count),comments.summary(total_count),shares&limit=100&access_token=${fullAccount?.accessToken}`
        );

        const fbData = await fbResponse.json();

        return c.json({
          pageId: fbAccount.accountId,
          pageName: fbAccount.username,
          tokenPreview: fullAccount?.accessToken?.substring(0, 50) + '...',
          tokenLength: fullAccount?.accessToken?.length,
          fbResponse: fbData,
          status: fbResponse.status,
        });
      } catch (error: any) {
        return c.json({ error: error.message, stack: error.stack }, 500);
      }
    });

    // Get Facebook posts for an agency
    this.router.get('/posts/:agencyId', async (c) => {
      try {
        const agencyId = c.req.param('agencyId');
        console.log('[Facebook API] Fetching posts for agency:', agencyId);

        // Get accounts with tokens from database
        const accountService = await import(
          '@/application/services/SocialAccountService'
        );
        const socialAccountRepo = await import(
          '@/infrastructure/repositories/SocialAccountRepository'
        );
        const service = new accountService.SocialAccountService(
          new socialAccountRepo.SocialAccountRepository()
        );
        const connectedAccounts = await service.getConnectedAccounts(agencyId);

        console.log(
          '[Facebook API] Connected accounts:',
          connectedAccounts.length
        );

        // Filter for Facebook accounts with valid tokens
        const facebookAccountsWithTokens = connectedAccounts
          .filter(
            (acc) =>
              acc.platformName === 'Facebook' &&
              acc.accountId !== null &&
              acc.accessToken !== null
          )
          .map((acc) => ({
            accountId: acc.accountId!,
            accessToken: acc.accessToken!,
            username: acc.username || 'Unknown',
          }));

        console.log(
          '[Facebook API] Facebook accounts with tokens:',
          facebookAccountsWithTokens.length
        );

        const posts = await FacebookService.getAgencyFacebookPosts(
          agencyId,
          facebookAccountsWithTokens
        );

        console.log(
          '[Facebook API] Successfully fetched',
          posts.length,
          'posts'
        );

        return c.json({
          success: true,
          posts,
          total: posts.length,
        });
      } catch (error: any) {
        console.error('[Facebook API] Error fetching Facebook posts:', error);
        return c.json(
          {
            success: false,
            error: error.message || 'Failed to fetch Facebook posts',
          },
          500
        );
      }
    });
  }
}
