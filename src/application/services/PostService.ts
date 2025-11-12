// Application Layer - Post Service
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { ISocialAccountRepository } from '@/domain/repositories/ISocialAccountRepository';
import {
  CreatePostDTO,
  PostResponseDTO,
  PublishPostResponseDTO,
} from '../dtos/PostDTO';
import { FacebookService } from './FacebookService';

export class PostService {
  constructor(
    private postRepo: IPostRepository,
    private socialAccountRepo: ISocialAccountRepository
  ) {}

  /**
   * Create and optionally publish a post
   * NOTE: This no longer saves to local database - posts go directly to Facebook
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

    const results: PublishPostResponseDTO['results'] = [];

    // Publish directly to Facebook (no local database storage)
    for (const account of validAccounts) {
      if (!account) continue;

      try {
        // Use accountId (Facebook Page ID) if available
        if (!account.accountId) {
          throw new Error(
            `Social account ${account.username} does not have a Facebook Page ID (accountId). Only Facebook Pages can post, not user accounts.`
          );
        }

        // Calculate scheduled time if provided
        let scheduledPublishTime: number | undefined;
        if (scheduledAt && !publishNow) {
          scheduledPublishTime = Math.floor(scheduledAt.getTime() / 1000);
        }

        // Publish to Facebook using FacebookService
        const result = await FacebookService.publishPost(
          account.accountId,
          account.accessToken,
          dto.content,
          scheduledPublishTime,
          publishNow
        );

        if (result.success) {
          results.push({
            socialAccountId: account.id,
            platformName: 'Facebook',
            success: true,
            externalPostId: result.postId,
          });
        } else {
          throw new Error(result.error || 'Failed to publish');
        }
      } catch (error) {
        console.error('Error publishing to Facebook:', {
          accountId: account?.accountId,
          username: account?.username,
          error: (error as Error).message,
        });

        results.push({
          socialAccountId: account.id,
          platformName: 'Facebook',
          success: false,
          error: (error as Error).message,
        });
      }
    }

    const allSuccess = results.every((r) => r.success);
    const someSuccess = results.some((r) => r.success);

    return {
      postId: results[0]?.externalPostId || 'unknown',
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
   * Get paginated posts for an agency with filters
   */
  async getAgencyPostsPaginated(
    agencyId: string,
    options: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
    }
  ) {
    return await this.postRepo.getPostsByAgencyIdPaginated(agencyId, options);
  }

  /**
   * Get posts count by status
   */
  async getPostsCountByStatus(agencyId: string) {
    return await this.postRepo.getPostsCountByStatus(agencyId);
  }
}
