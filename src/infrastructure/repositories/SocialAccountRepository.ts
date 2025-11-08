import { eq, and } from 'drizzle-orm';
import { db } from '../database/drizzle';
import { socialAccounts, platforms } from '../database/schema';
import { ISocialAccountRepository } from '../../domain/repositories/ISocialAccountRepository';
import { SocialAccountEntity } from '../../domain/entities/SocialAccountEntity';
import { PlatformEntity } from '../../domain/entities/PlatformEntity';

export class SocialAccountRepository implements ISocialAccountRepository {
  async createSocialAccount(
    agencyId: string,
    platformId: string,
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    username: string,
    profileUrl?: string,
    profilePicture?: string,
    accountId?: string
  ): Promise<SocialAccountEntity> {
    const [account] = await db
      .insert(socialAccounts)
      .values({
        agencyId,
        platformId,
        accessToken,
        refreshToken,
        expiresAt,
        username,
      })
      .returning();

    return new SocialAccountEntity(
      account.id,
      account.agencyId,
      account.platformId,
      account.accessToken,
      account.refreshToken,
      account.expiresAt,
      account.username,
      account.createdAt,
      account.updatedAt,
      undefined,
      profileUrl,
      profilePicture,
      accountId
    );
  }

  async getSocialAccountById(id: string): Promise<SocialAccountEntity | null> {
    const [account] = await db
      .select({
        id: socialAccounts.id,
        agencyId: socialAccounts.agencyId,
        platformId: socialAccounts.platformId,
        platformName: platforms.name,
        accessToken: socialAccounts.accessToken,
        refreshToken: socialAccounts.refreshToken,
        expiresAt: socialAccounts.expiresAt,
        username: socialAccounts.username,
        createdAt: socialAccounts.createdAt,
        updatedAt: socialAccounts.updatedAt,
      })
      .from(socialAccounts)
      .leftJoin(platforms, eq(socialAccounts.platformId, platforms.id))
      .where(eq(socialAccounts.id, id))
      .limit(1);

    if (!account) return null;

    return new SocialAccountEntity(
      account.id,
      account.agencyId,
      account.platformId,
      account.accessToken,
      account.refreshToken,
      account.expiresAt,
      account.username,
      account.createdAt,
      account.updatedAt,
      account.platformName || undefined
    );
  }

  async getSocialAccountsByAgencyId(
    agencyId: string
  ): Promise<SocialAccountEntity[]> {
    const accounts = await db
      .select({
        id: socialAccounts.id,
        agencyId: socialAccounts.agencyId,
        platformId: socialAccounts.platformId,
        platformName: platforms.name,
        accessToken: socialAccounts.accessToken,
        refreshToken: socialAccounts.refreshToken,
        expiresAt: socialAccounts.expiresAt,
        username: socialAccounts.username,
        createdAt: socialAccounts.createdAt,
        updatedAt: socialAccounts.updatedAt,
        profileUrl: socialAccounts.profileUrl,
        profilePicture: socialAccounts.profilePicture,
        accountId: socialAccounts.accountId,
      })
      .from(socialAccounts)
      .leftJoin(platforms, eq(socialAccounts.platformId, platforms.id))
      .where(eq(socialAccounts.agencyId, agencyId));

    return accounts.map(
      (account) =>
        new SocialAccountEntity(
          account.id,
          account.agencyId,
          account.platformId,
          account.accessToken,
          account.refreshToken,
          account.expiresAt,
          account.username,
          account.createdAt,
          account.updatedAt,
          account.platformName || undefined,
          account.profileUrl || null,
          account.profilePicture || null,
          account.accountId || null
        )
    );
  }

  async getSocialAccountByPlatformAndAgency(
    agencyId: string,
    platformId: string
  ): Promise<SocialAccountEntity | null> {
    const [account] = await db
      .select({
        id: socialAccounts.id,
        agencyId: socialAccounts.agencyId,
        platformId: socialAccounts.platformId,
        platformName: platforms.name,
        accessToken: socialAccounts.accessToken,
        refreshToken: socialAccounts.refreshToken,
        expiresAt: socialAccounts.expiresAt,
        username: socialAccounts.username,
        createdAt: socialAccounts.createdAt,
        updatedAt: socialAccounts.updatedAt,
      })
      .from(socialAccounts)
      .leftJoin(platforms, eq(socialAccounts.platformId, platforms.id))
      .where(
        and(
          eq(socialAccounts.agencyId, agencyId),
          eq(socialAccounts.platformId, platformId)
        )
      )
      .limit(1);

    if (!account) return null;

    return new SocialAccountEntity(
      account.id,
      account.agencyId,
      account.platformId,
      account.accessToken,
      account.refreshToken,
      account.expiresAt,
      account.username,
      account.createdAt,
      account.updatedAt,
      account.platformName || undefined
    );
  }

  async updateSocialAccountTokens(
    id: string,
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null
  ): Promise<void> {
    await db
      .update(socialAccounts)
      .set({
        accessToken,
        refreshToken,
        expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(socialAccounts.id, id));
  }

  async deleteSocialAccount(id: string): Promise<void> {
    await db.delete(socialAccounts).where(eq(socialAccounts.id, id));
  }

  async getPlatformByName(name: string): Promise<PlatformEntity | null> {
    const [platform] = await db
      .select()
      .from(platforms)
      .where(eq(platforms.name, name))
      .limit(1);

    if (!platform) return null;

    return new PlatformEntity(
      platform.id,
      platform.name,
      platform.apiBaseUrl,
      platform.createdAt,
      platform.updatedAt
    );
  }

  async getAllPlatforms(): Promise<PlatformEntity[]> {
    const platformList = await db.select().from(platforms);

    return platformList.map(
      (platform) =>
        new PlatformEntity(
          platform.id,
          platform.name,
          platform.apiBaseUrl,
          platform.createdAt,
          platform.updatedAt
        )
    );
  }

  async createPlatform(
    name: string,
    apiBaseUrl: string
  ): Promise<PlatformEntity> {
    const [platform] = await db
      .insert(platforms)
      .values({
        name,
        apiBaseUrl,
      })
      .returning();

    return new PlatformEntity(
      platform.id,
      platform.name,
      platform.apiBaseUrl,
      platform.createdAt,
      platform.updatedAt
    );
  }
}
