import { ISocialAccountRepository } from '../../domain/repositories/ISocialAccountRepository';
import { SocialAccountEntity } from '../../domain/entities/SocialAccountEntity';
import { PlatformEntity } from '../../domain/entities/PlatformEntity';
import crypto from 'crypto';

interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

interface FacebookUserData {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

interface FacebookPageData {
  id: string;
  name: string;
  access_token: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

export class SocialAccountService {
  private socialAccountRepository: ISocialAccountRepository;
  private facebookAppId: string;
  private facebookAppSecret: string;
  private facebookRedirectUri: string;

  constructor(socialAccountRepository: ISocialAccountRepository) {
    this.socialAccountRepository = socialAccountRepository;
    this.facebookAppId = process.env.FACEBOOK_APP_ID || '';
    this.facebookAppSecret = process.env.FACEBOOK_APP_SECRET || '';
    this.facebookRedirectUri =
      process.env.FACEBOOK_REDIRECT_URI ||
      'http://localhost:3000/api/social-accounts/facebook/callback';

    if (!this.facebookAppId || !this.facebookAppSecret) {
      console.warn(
        'Facebook OAuth credentials not configured. Set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET environment variables.'
      );
    }
  }

  // Generate Facebook OAuth URL
  generateFacebookAuthUrl(agencyId: string): string {
    const state = this.generateState(agencyId);
    // Request only valid, approved scopes. Advanced permissions require App Review.
    // For Pages access during development we request pages-related scopes.
    // NOTE: pages_* scopes require App Review before non-role users can grant them.
    const scope = [
      'public_profile',
      'email',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
    ].join(',');

    const params = new URLSearchParams({
      client_id: this.facebookAppId,
      redirect_uri: this.facebookRedirectUri,
      state,
      scope,
      response_type: 'code',
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  // Generate and encode state parameter
  private generateState(agencyId: string): string {
    const stateData = {
      agencyId,
      nonce: crypto.randomBytes(16).toString('hex'),
      timestamp: Date.now(),
    };
    return Buffer.from(JSON.stringify(stateData)).toString('base64');
  }

  // Verify and decode state parameter
  private verifyState(state: string): { agencyId: string } | null {
    try {
      const decoded = JSON.parse(
        Buffer.from(state, 'base64').toString('utf-8')
      );
      // Verify timestamp is within 10 minutes
      if (Date.now() - decoded.timestamp > 10 * 60 * 1000) {
        return null;
      }
      return { agencyId: decoded.agencyId };
    } catch {
      return null;
    }
  }

  // Exchange code for access token
  async exchangeCodeForToken(code: string): Promise<FacebookTokenResponse> {
    const params = new URLSearchParams({
      client_id: this.facebookAppId,
      client_secret: this.facebookAppSecret,
      redirect_uri: this.facebookRedirectUri,
      code,
    });

    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for token: ${error}`);
    }

    return await response.json();
  }

  // Exchange a short-lived user token for a long-lived token
  async exchangeShortLivedForLongLived(
    shortLivedToken: string
  ): Promise<FacebookTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: this.facebookAppId,
      client_secret: this.facebookAppSecret,
      fb_exchange_token: shortLivedToken,
    });

    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange for long-lived token: ${error}`);
    }

    return await response.json();
  }

  // Get user data from Facebook
  async getFacebookUserData(accessToken: string): Promise<FacebookUserData> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user data: ${error}`);
    }

    return await response.json();
  }

  // Get Facebook Pages managed by the user
  async getFacebookPages(accessToken: string): Promise<FacebookPageData[]> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,picture&access_token=${accessToken}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get pages: ${error}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  // Connect Facebook account
  async connectFacebookAccount(
    code: string,
    state: string
  ): Promise<{
    success: boolean;
    pages?: FacebookPageData[];
    error?: string;
    agencyId?: string;
  }> {
    try {
      // Verify state
      const stateData = this.verifyState(state);
      if (!stateData) {
        return { success: false, error: 'Invalid or expired state parameter' };
      }

      // Exchange code for token (short-lived)
      const tokenData = await this.exchangeCodeForToken(code);

      // Exchange short-lived user token for a long-lived token
      let longLivedTokenData: FacebookTokenResponse | null = null;
      try {
        longLivedTokenData = await this.exchangeShortLivedForLongLived(
          tokenData.access_token
        );
      } catch (err) {
        // Log and fall back to short-lived token (still try to proceed)
        console.warn(
          'Failed to exchange for long-lived token, using short-lived token',
          err
        );
        longLivedTokenData = tokenData;
      }

      const userAccessToken = longLivedTokenData.access_token;
      const expiresIn = longLivedTokenData.expires_in;

      // Get user profile
      const userData = await this.getFacebookUserData(userAccessToken);

      // Save user profile as a connected account
      let platform =
        await this.socialAccountRepository.getPlatformByName('Facebook');
      if (!platform) {
        platform = await this.socialAccountRepository.createPlatform(
          'Facebook',
          'https://graph.facebook.com/v18.0'
        );
      }
      // Check if user account already exists
      const existingAccounts =
        await this.socialAccountRepository.getSocialAccountsByAgencyId(
          stateData.agencyId
        );
      // User account is identified by NOT having an accountId (pages have accountId)
      const userAccount = existingAccounts.find(
        (acc) => acc.platformId === platform.id && !acc.accountId
      );

      const expiresAt = expiresIn
        ? new Date(Date.now() + expiresIn * 1000)
        : null;

      if (!userAccount) {
        // User account should NOT have accountId - only pages have accountId
        await this.socialAccountRepository.createSocialAccount(
          stateData.agencyId,
          platform.id,
          userAccessToken,
          null,
          expiresAt,
          userData.name,
          `https://www.facebook.com/${userData.id}`,
          userData.picture?.data?.url,
          undefined // User accounts don't have accountId
        );
      } else {
        await this.socialAccountRepository.updateSocialAccountTokens(
          userAccount.id,
          userAccessToken,
          null,
          expiresAt
        );
      }

      // Get pages using the long-lived user token
      const pages = await this.getFacebookPages(userAccessToken);

      // Save all pages as connected accounts
      for (const page of pages) {
        await this.saveFacebookPage(
          stateData.agencyId,
          page.id,
          page.name,
          page.access_token,
          page.picture?.data?.url
        );
      }

      return {
        success: true,
        pages,
        agencyId: stateData.agencyId,
      };
    } catch (error) {
      console.error('Error connecting Facebook account:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Save Facebook Page as a connected account
  async saveFacebookPage(
    agencyId: string,
    pageId: string,
    pageName: string,
    pageAccessToken: string,
    profilePicture?: string
  ): Promise<SocialAccountEntity> {
    // Get or create Facebook platform
    let platform =
      await this.socialAccountRepository.getPlatformByName('Facebook');
    if (!platform) {
      platform = await this.socialAccountRepository.createPlatform(
        'Facebook',
        'https://graph.facebook.com/v18.0'
      );
    }

    // Check if account for this page already exists
    const existingAccount =
      await this.socialAccountRepository.getSocialAccountsByAgencyId(agencyId);
    const pageAccount = existingAccount.find(
      (acc) => acc.platformId === platform.id && acc.accountId === pageId
    );
    if (pageAccount) {
      // Update token for this page
      await this.socialAccountRepository.updateSocialAccountTokens(
        pageAccount.id,
        pageAccessToken,
        null,
        null
      );
      return pageAccount;
    }
    // Create new account for this page
    return await this.socialAccountRepository.createSocialAccount(
      agencyId,
      platform.id,
      pageAccessToken,
      null,
      null,
      pageName,
      `https://www.facebook.com/${pageId}`,
      profilePicture,
      pageId
    );
  }

  // Get connected accounts for an agency
  async getConnectedAccounts(agencyId: string): Promise<SocialAccountEntity[]> {
    return await this.socialAccountRepository.getSocialAccountsByAgencyId(
      agencyId
    );
  }

  // Resync Facebook pages for an agency using any stored Facebook user token
  // Finds a Facebook user account (one whose access token returns /me), calls /me/accounts
  // and upserts pages via saveFacebookPage. Returns a summary of created/updated pages.
  async resyncFacebookPages(agencyId: string): Promise<{
    success: boolean;
    created: number;
    updated: number;
    pages?: FacebookPageData[];
    error?: string;
  }> {
    try {
      const accounts =
        await this.socialAccountRepository.getSocialAccountsByAgencyId(
          agencyId
        );

      // Find a candidate account that can act as the Facebook user token
      let userAccountToken: string | null = null;
      for (const acc of accounts) {
        if (acc.platformName !== 'Facebook') continue;
        try {
          const me = await this.getFacebookUserData(acc.accessToken);
          if (me && me.id) {
            userAccountToken = acc.accessToken;
            break;
          }
        } catch (e) {
          // ignore and try next account
          continue;
        }
      }

      if (!userAccountToken) {
        return {
          success: false,
          created: 0,
          updated: 0,
          error: 'No valid Facebook user token found for agency',
        };
      }

      const pages = await this.getFacebookPages(userAccountToken);

      let created = 0;
      let updated = 0;

      // Refresh local snapshot of accounts for lookup
      const beforeAccounts =
        await this.socialAccountRepository.getSocialAccountsByAgencyId(
          agencyId
        );

      for (const page of pages) {
        const existingPage = beforeAccounts.find(
          (a) => a.platformName === 'Facebook' && a.accountId === page.id
        );
        if (existingPage) {
          updated++;
        } else {
          created++;
        }
        // Use existing saveFacebookPage logic which will update tokens if present
        await this.saveFacebookPage(
          agencyId,
          page.id,
          page.name,
          page.access_token,
          page.picture?.data?.url
        );
      }

      return { success: true, created, updated, pages };
    } catch (error) {
      console.error('Error resyncing Facebook pages:', error);
      return {
        success: false,
        created: 0,
        updated: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Fix accountId for existing Facebook accounts
  // This identifies which accounts are users vs pages and corrects the accountId field
  async fixFacebookAccountIds(agencyId: string): Promise<{
    success: boolean;
    fixed: number;
    errors: string[];
  }> {
    try {
      const accounts =
        await this.socialAccountRepository.getSocialAccountsByAgencyId(
          agencyId
        );
      const fbAccounts = accounts.filter((a) => a.platformName === 'Facebook');

      let fixed = 0;
      const errors: string[] = [];

      for (const account of fbAccounts) {
        if (!account.accountId) continue; // Already correct (user account)

        try {
          // Try to fetch page info
          const pageRes = await fetch(
            `https://graph.facebook.com/v18.0/${account.accountId}?fields=id,name&access_token=${account.accessToken}`
          );
          const pageData = await pageRes.json();

          // If error or if the response indicates it's not a page, it's a user account
          if (pageData.error || !pageData.name) {
            // This is a user account - remove accountId
            await (this.socialAccountRepository as any).updateAccountId(
              account.id,
              null
            );
            console.log(
              `Fixed ${account.username}: removed accountId (user account)`
            );
            fixed++;
          }
          // else: it's a valid page, keep accountId as is
        } catch (error) {
          errors.push(
            `Error checking ${account.username}: ${(error as Error).message}`
          );
        }
      }

      return { success: true, fixed, errors };
    } catch (error) {
      return {
        success: false,
        fixed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  // Disconnect account
  async disconnectAccount(accountId: string): Promise<void> {
    // Attempt to determine if this account is a Facebook "user" account.
    // If it is, also remove all Facebook page accounts for the same agency.
    const account =
      await this.socialAccountRepository.getSocialAccountById(accountId);
    if (!account) return;

    // Only treat the account as a Facebook "user" token (which should remove all
    // Facebook accounts for the agency) when the stored record has no accountId.
    // Page records have an accountId and should only delete the single page.
    if (account.platformName === 'Facebook' && !account.accountId) {
      try {
        // Verify token is valid for a user
        const me = await this.getFacebookUserData(account.accessToken);
        if (me && me.id) {
          const all =
            await this.socialAccountRepository.getSocialAccountsByAgencyId(
              account.agencyId
            );
          for (const a of all) {
            if (a.platformName === 'Facebook') {
              await this.socialAccountRepository.deleteSocialAccount(a.id);
            }
          }
          return;
        }
      } catch (e) {
        // If verification fails, fall back to deleting single account below
      }
    }

    // Default: delete only the requested account
    await this.socialAccountRepository.deleteSocialAccount(accountId);
  }

  // Get all platforms
  async getAllPlatforms(): Promise<PlatformEntity[]> {
    return await this.socialAccountRepository.getAllPlatforms();
  }
}
