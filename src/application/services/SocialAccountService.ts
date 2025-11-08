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
    const scope = ['public_profile', 'email'].join(',');

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

      // Exchange code for token
      const tokenData = await this.exchangeCodeForToken(code);

      // Get user profile
      const userData = await this.getFacebookUserData(tokenData.access_token);

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
      const userAccount = existingAccounts.find(
        (acc) => acc.platformId === platform.id && acc.accountId === userData.id
      );
      if (!userAccount) {
        await this.socialAccountRepository.createSocialAccount(
          stateData.agencyId,
          platform.id,
          tokenData.access_token,
          null,
          null,
          userData.name,
          `https://www.facebook.com/${userData.id}`,
          userData.picture?.data?.url,
          userData.id
        );
      } else {
        await this.socialAccountRepository.updateSocialAccountTokens(
          userAccount.id,
          tokenData.access_token,
          null,
          null
        );
      }

      // Get pages
      const pages = await this.getFacebookPages(tokenData.access_token);
      console.log('Facebook /me/accounts response:', pages);

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

  // Disconnect account
  async disconnectAccount(accountId: string): Promise<void> {
    await this.socialAccountRepository.deleteSocialAccount(accountId);
  }

  // Get all platforms
  async getAllPlatforms(): Promise<PlatformEntity[]> {
    return await this.socialAccountRepository.getAllPlatforms();
  }
}
