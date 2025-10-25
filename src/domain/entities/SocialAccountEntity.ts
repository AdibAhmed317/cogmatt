export class SocialAccountEntity {
  id: string;
  agencyId: string;
  platformId: string;
  platformName?: string; // Optional, for joined queries
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  username: string;
  profileUrl?: string | null;
  profilePicture?: string | null;
  accountId?: string | null; // Platform-specific account ID (e.g., Facebook Page ID)
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    agencyId: string,
    platformId: string,
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    username: string,
    createdAt: Date,
    updatedAt: Date,
    platformName?: string,
    profileUrl?: string | null,
    profilePicture?: string | null,
    accountId?: string | null
  ) {
    this.id = id;
    this.agencyId = agencyId;
    this.platformId = platformId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;
    this.username = username;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.platformName = platformName;
    this.profileUrl = profileUrl;
    this.profilePicture = profilePicture;
    this.accountId = accountId;
  }

  isTokenExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() >= this.expiresAt;
  }
}
