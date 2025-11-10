// Application Layer - Post Service
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { ISocialAccountRepository } from '@/domain/repositories/ISocialAccountRepository';
import {
  CreatePostDTO,
  PostResponseDTO,
  PublishPostResponseDTO,
} from '../dtos/PostDTO';

export class PostService {
  constructor(
    private postRepo: IPostRepository,
    private socialAccountRepo: ISocialAccountRepository
  ) {}

  /**
   * Create and optionally publish a post
   */
  async createPost(
    dto: CreatePostDTO,
    publishNow: boolean = false
  ): Promise<PublishPostResponseDTO> {
    const scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : null;

    // Validate social accounts belong to the agency
    const socialAccounts = await Promise.all(
      dto.socialAccountIds.map((id) =>
        this.socialAccountRepo.getSocialAccountById(id)
      )
    );

    const validAccounts = socialAccounts.filter(
      (acc) => acc && acc.agencyId === dto.agencyId
    );

    if (validAccounts.length === 0) {
      throw new Error('No valid social accounts found for this agency');
    }

    // Create post record
    const post = await this.postRepo.createPost(
      dto.agencyId,
      dto.content,
      dto.media || null,
      scheduledAt,
      publishNow ? 'posted' : 'pending'
    );

    const results: PublishPostResponseDTO['results'] = [];

    // If publishing now, post to each platform
    if (publishNow) {
      for (const account of validAccounts) {
        if (!account) continue;

        try {
          const platform =
            await this.socialAccountRepo.getPlatformByName('Facebook');
          if (!platform) {
            throw new Error('Facebook platform not found');
          }

          // Use accountId (Facebook Page ID) if available, otherwise skip
          if (!account.accountId) {
            throw new Error(
              `Social account ${account.username} does not have a Facebook Page ID (accountId). Only Facebook Pages can post, not user accounts.`
            );
          }

          // Publish to Facebook
          const externalPostId = await this.publishToFacebook(
            account.accountId,
            account.accessToken,
            dto.content,
            dto.media
          );

          // Record success
          await this.postRepo.createPostPlatformStatus(
            post.id,
            platform.id,
            'posted',
            { externalPostId },
            new Date()
          );

          results.push({
            socialAccountId: account.id,
            platformName: 'Facebook',
            success: true,
            externalPostId,
          });
        } catch (error) {
          console.error('Error publishing to Facebook:', {
            accountId: account?.accountId,
            username: account?.username,
            error: (error as Error).message,
          });

          // Record failure
          const platform =
            await this.socialAccountRepo.getPlatformByName('Facebook');
          if (platform) {
            await this.postRepo.createPostPlatformStatus(
              post.id,
              platform.id,
              'failed',
              { error: (error as Error).message }
            );
          }

          results.push({
            socialAccountId: account.id,
            platformName: 'Facebook',
            success: false,
            error: (error as Error).message,
          });
        }
      }
    } else {
      // Just create pending platform statuses
      for (const account of validAccounts) {
        if (!account) continue;
        const platform =
          await this.socialAccountRepo.getPlatformByName('Facebook');
        if (platform) {
          await this.postRepo.createPostPlatformStatus(
            post.id,
            platform.id,
            'pending'
          );
        }

        results.push({
          socialAccountId: account.id,
          platformName: 'Facebook',
          success: true,
        });
      }
    }

    const allSuccess = results.every((r) => r.success);
    const someSuccess = results.some((r) => r.success);

    return {
      postId: post.id,
      status: allSuccess ? 'success' : someSuccess ? 'partial' : 'failed',
      results,
    };
  }

  /**
   * Get post by ID with platform statuses
   */
  async getPostWithStatuses(postId: string): Promise<PostResponseDTO> {
    const post = await this.postRepo.getPostById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const platformStatuses =
      await this.postRepo.getPostPlatformStatuses(postId);

    const platforms = await Promise.all(
      platformStatuses.map(async (status) => {
        const platform =
          await this.socialAccountRepo.getPlatformByName('Facebook'); // TODO: get by ID
        return {
          platformId: status.platformId,
          platformName: platform?.name || 'Unknown',
          status: status.status,
          postedAt: status.postedAt,
        };
      })
    );

    return {
      id: post.id,
      agencyId: post.agencyId,
      content: post.content,
      media: post.media,
      scheduledAt: post.scheduledAt,
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      platforms,
    };
  }

  /**
   * Get all posts for an agency
   */
  async getAgencyPosts(agencyId: string): Promise<PostResponseDTO[]> {
    const posts = await this.postRepo.getPostsByAgencyId(agencyId);

    return Promise.all(posts.map((post) => this.getPostWithStatuses(post.id)));
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<void> {
    await this.postRepo.deletePost(postId);
  }

  /**
   * Publish to Facebook via Graph API
   */
  private async publishToFacebook(
    pageId: string,
    accessToken: string,
    message: string,
    media?: any
  ): Promise<string> {
    const endpoint = `https://graph.facebook.com/v18.0/${pageId}/feed`;

    // Facebook expects form data, not JSON
    const formData = new URLSearchParams();
    formData.append('message', message);
    formData.append('access_token', accessToken);

    // If media is provided, handle it
    if (media && media.url) {
      formData.append('link', media.url);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Facebook API Error:', {
        status: response.status,
        error: responseData,
      });
      throw new Error(
        responseData.error?.message || `Facebook API error: ${response.status}`
      );
    }

    return responseData.id; // Facebook post ID
  }
}
