import { Hono, Context } from 'hono';
import { SocialAccountService } from '../../application/services/SocialAccountService';
import { SocialAccountRepository } from '../../infrastructure/repositories/SocialAccountRepository';
import { SocialAccountResponseDTO } from '../../application/dtos/SocialAccountDTO';
import { PlatformResponseDTO } from '../../application/dtos/PlatformDTO';

export class SocialAccountController {
  public router = new Hono();
  private socialAccountService: SocialAccountService;

  constructor() {
    const socialAccountRepository = new SocialAccountRepository();
    this.socialAccountService = new SocialAccountService(
      socialAccountRepository
    );
    this.initRoutes();
  }

  private initRoutes() {
    // Get all platforms
    this.router.get('/platforms', (c) => this.getPlatforms(c));

    // Get connected accounts for an agency
    this.router.get('/:agencyId', (c) => this.getConnectedAccounts(c));

    // Facebook OAuth flow
    this.router.get('/facebook/auth', (c) => this.initiateFacebookAuth(c));
    this.router.get('/facebook/callback', (c) =>
      this.handleFacebookCallback(c)
    );
    this.router.post('/facebook/connect-page', (c) =>
      this.connectFacebookPage(c)
    );

    // Resync pages for an agency (one-off/admin)
    this.router.post('/facebook/resync', (c) => this.resyncFacebookPages(c));

    // Fix accountId for existing accounts
    this.router.post('/facebook/fix-account-ids', (c) =>
      this.fixFacebookAccountIds(c)
    );

    // Cleanup user accounts (delete accounts without accountId)
    this.router.post('/facebook/cleanup', (c) => this.cleanupUserAccounts(c));

    // Post to Facebook Page
    this.router.post('/facebook/post-page', (c) => this.postToFacebookPage(c));

    // Disconnect account
    this.router.delete('/:accountId', (c) => this.disconnectAccount(c));
  }

  // POST /api/social-accounts/facebook/post-page
  async postToFacebookPage(c: Context) {
    try {
      const body = await c.req.json();
      const { agencyId, pageId, message } = body;

      if (!agencyId || !pageId || !message) {
        return c.json(
          { error: 'Missing required fields: agencyId, pageId, message' },
          400
        );
      }

      // Get the connected account for this agency and page
      const accounts =
        await this.socialAccountService.getConnectedAccounts(agencyId);
      const pageAccount = accounts.find(
        (acc) => acc.platformName === 'Facebook' && acc.accountId === pageId
      );
      if (!pageAccount) {
        return c.json({ error: 'Facebook Page not connected' }, 404);
      }

      // Post to Facebook Page using Graph API
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/feed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            access_token: pageAccount.accessToken,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        return c.json(
          { error: result.error?.message || 'Failed to post to Facebook Page' },
          500
        );
      }
      return c.json({ success: true, postId: result.id });
    } catch (error) {
      console.error('Error posting to Facebook page:', error);
      return c.json({ error: 'Failed to post to Facebook page' }, 500);
    }
  }

  // GET /api/social-accounts/platforms
  async getPlatforms(c: Context) {
    try {
      const platforms = await this.socialAccountService.getAllPlatforms();
      const response = platforms.map(
        (p) => new PlatformResponseDTO(p.id, p.name, p.apiBaseUrl)
      );
      return c.json(response);
    } catch (error) {
      console.error('Error fetching platforms:', error);
      return c.json({ error: 'Failed to fetch platforms' }, 500);
    }
  }

  // GET /api/social-accounts/:agencyId
  async getConnectedAccounts(c: Context) {
    try {
      const agencyId = c.req.param('agencyId');
      if (!agencyId) {
        return c.json({ error: 'Agency ID is required' }, 400);
      }

      const accounts =
        await this.socialAccountService.getConnectedAccounts(agencyId);

      const response = accounts.map(
        (account) =>
          new SocialAccountResponseDTO(
            account.id,
            account.agencyId,
            account.platformId,
            account.username,
            account.isTokenExpired(),
            account.createdAt,
            account.updatedAt,
            account.platformName,
            account.profileUrl,
            account.profilePicture,
            account.accountId
          )
      );

      return c.json(response);
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      return c.json({ error: 'Failed to fetch connected accounts' }, 500);
    }
  }

  // GET /api/social-accounts/facebook/auth
  async initiateFacebookAuth(c: Context) {
    try {
      const agencyId = c.req.query('agencyId');
      if (!agencyId) {
        return c.json({ error: 'Agency ID is required' }, 400);
      }

      const authUrl =
        this.socialAccountService.generateFacebookAuthUrl(agencyId);
      return c.json({ authUrl });
    } catch (error) {
      console.error('Error initiating Facebook auth:', error);
      return c.json({ error: 'Failed to initiate Facebook auth' }, 500);
    }
  }

  // GET /api/social-accounts/facebook/callback
  async handleFacebookCallback(c: Context) {
    try {
      const code = c.req.query('code');
      const state = c.req.query('state');

      if (!code || !state) {
        return c.html(`
          <html>
            <body>
              <script>
                window.opener.postMessage({ 
                  type: 'FACEBOOK_AUTH_ERROR', 
                  error: 'Missing authorization code or state' 
                }, '*');
                window.close();
              </script>
            </body>
          </html>
        `);
      }

      const result = await this.socialAccountService.connectFacebookAccount(
        code,
        state
      );

      if (!result.success) {
        return c.html(`
          <html>
            <body>
              <script>
                window.opener.postMessage({ 
                  type: 'FACEBOOK_AUTH_ERROR', 
                  error: '${result.error || 'Unknown error'}' 
                }, '*');
                window.close();
              </script>
            </body>
          </html>
        `);
      }

      // Return HTML that sends message to parent window with pages data
      return c.html(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ 
                type: 'FACEBOOK_AUTH_SUCCESS', 
                pages: ${JSON.stringify(result.pages)},
                agencyId: '${result.agencyId}'
              }, '*');
              window.close();
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error handling Facebook callback:', error);
      return c.html(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ 
                type: 'FACEBOOK_AUTH_ERROR', 
                error: 'Failed to complete Facebook authentication' 
              }, '*');
              window.close();
            </script>
          </body>
        </html>
      `);
    }
  }

  // POST /api/social-accounts/facebook/connect-page
  async connectFacebookPage(c: Context) {
    try {
      const body = await c.req.json();
      const { agencyId, pageId, pageName, pageAccessToken, profilePicture } =
        body;

      if (!agencyId || !pageId || !pageName || !pageAccessToken) {
        return c.json(
          {
            error:
              'Missing required fields: agencyId, pageId, pageName, pageAccessToken',
          },
          400
        );
      }

      const account = await this.socialAccountService.saveFacebookPage(
        agencyId,
        pageId,
        pageName,
        pageAccessToken,
        profilePicture
      );

      const response = new SocialAccountResponseDTO(
        account.id,
        account.agencyId,
        account.platformId,
        account.username,
        account.isTokenExpired(),
        account.createdAt,
        account.updatedAt,
        account.platformName,
        account.profileUrl,
        account.profilePicture,
        account.accountId
      );

      return c.json(response);
    } catch (error) {
      console.error('Error connecting Facebook page:', error);
      return c.json({ error: 'Failed to connect Facebook page' }, 500);
    }
  }

  // POST /api/social-accounts/facebook/resync
  async resyncFacebookPages(c: Context) {
    try {
      const body = await c.req.json();
      const agencyId = body?.agencyId || c.req.query('agencyId');
      if (!agencyId) {
        return c.json({ error: 'Agency ID is required' }, 400);
      }

      const result =
        await this.socialAccountService.resyncFacebookPages(agencyId);

      if (!result.success) {
        return c.json({ error: result.error || 'Resync failed' }, 500);
      }

      return c.json({
        success: true,
        created: result.created,
        updated: result.updated,
        pages: result.pages,
      });
    } catch (error) {
      console.error('Error resyncing Facebook pages:', error);
      return c.json({ error: 'Failed to resync Facebook pages' }, 500);
    }
  }

  // POST /api/social-accounts/facebook/fix-account-ids
  // This fixes existing accounts that have wrong accountId values
  async fixFacebookAccountIds(c: Context) {
    try {
      const body = await c.req.json();
      const agencyId = body?.agencyId || c.req.query('agencyId');
      if (!agencyId) {
        return c.json({ error: 'Agency ID is required' }, 400);
      }

      const result =
        await this.socialAccountService.fixFacebookAccountIds(agencyId);

      if (!result.success) {
        return c.json({ error: result.errors.join(', ') || 'Fix failed' }, 500);
      }

      return c.json({
        success: true,
        fixed: result.fixed,
        errors: result.errors,
        message: `Fixed ${result.fixed} accounts. They should now work correctly.`,
      });
    } catch (error) {
      console.error('Error fixing Facebook account IDs:', error);
      return c.json({ error: 'Failed to fix account IDs' }, 500);
    }
  }

  // POST /api/social-accounts/facebook/cleanup-user-accounts
  // Delete Facebook user accounts, keep only pages
  async cleanupUserAccounts(c: Context) {
    try {
      const body = await c.req.json();
      const agencyId = body?.agencyId || c.req.query('agencyId');
      if (!agencyId) {
        return c.json({ error: 'Agency ID is required' }, 400);
      }

      const accounts =
        await this.socialAccountService.getConnectedAccounts(agencyId);
      const fbAccounts = accounts.filter((a) => a.platformName === 'Facebook');

      let deleted = 0;
      const kept = [];

      for (const account of fbAccounts) {
        // If no accountId, it's a user account - delete it
        if (!account.accountId || account.accountId.trim() === '') {
          await this.socialAccountService.disconnectAccount(account.id);
          deleted++;
        } else {
          kept.push({
            username: account.username,
            accountId: account.accountId,
          });
        }
      }

      return c.json({
        success: true,
        deleted,
        kept,
        message: `Deleted ${deleted} user accounts, kept ${kept.length} pages`,
      });
    } catch (error) {
      console.error('Error cleaning up user accounts:', error);
      return c.json({ error: 'Failed to cleanup accounts' }, 500);
    }
  }

  // DELETE /api/social-accounts/:accountId
  async disconnectAccount(c: Context) {
    try {
      const accountId = c.req.param('accountId');
      if (!accountId) {
        return c.json({ error: 'Account ID is required' }, 400);
      }

      await this.socialAccountService.disconnectAccount(accountId);
      return c.json({ success: true });
    } catch (error) {
      console.error('Error disconnecting account:', error);
      return c.json({ error: 'Failed to disconnect account' }, 500);
    }
  }
}
