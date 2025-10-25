import { SocialAccountEntity } from '../entities/SocialAccountEntity';
import { PlatformEntity } from '../entities/PlatformEntity';

export interface ISocialAccountRepository {
  createSocialAccount(
    agencyId: string,
    platformId: string,
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    username: string,
    profileUrl?: string,
    profilePicture?: string,
    accountId?: string
  ): Promise<SocialAccountEntity>;

  getSocialAccountById(id: string): Promise<SocialAccountEntity | null>;

  getSocialAccountsByAgencyId(agencyId: string): Promise<SocialAccountEntity[]>;

  getSocialAccountByPlatformAndAgency(
    agencyId: string,
    platformId: string
  ): Promise<SocialAccountEntity | null>;

  updateSocialAccountTokens(
    id: string,
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null
  ): Promise<void>;

  deleteSocialAccount(id: string): Promise<void>;

  getPlatformByName(name: string): Promise<PlatformEntity | null>;

  getAllPlatforms(): Promise<PlatformEntity[]>;

  createPlatform(name: string, apiBaseUrl: string): Promise<PlatformEntity>;
}
