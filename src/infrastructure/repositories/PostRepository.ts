// Infrastructure Layer - Post Repository Implementation
// NOTE: This repository is deprecated. We now fetch posts directly from Facebook.
// Kept for backwards compatibility with existing controllers.

import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { PostEntity } from '@/domain/entities/PostEntity';

export class PostRepository implements IPostRepository {
  async createPost(): Promise<PostEntity> {
    throw new Error('Deprecated');
  }
  async getPostById(): Promise<PostEntity | null> {
    throw new Error('Deprecated');
  }
  async getPostsByAgencyId(): Promise<PostEntity[]> {
    throw new Error('Deprecated');
  }
  async updatePost(): Promise<PostEntity> {
    throw new Error('Deprecated');
  }
  async deletePost(): Promise<void> {
    throw new Error('Deprecated');
  }
  async createPostPlatformStatus(): Promise<void> {
    throw new Error('Deprecated');
  }
  async getPostPlatformStatuses(): Promise<any[]> {
    throw new Error('Deprecated');
  }
  async getPostsByAgencyIdPaginated(
    agencyId: string,
    options: any
  ): Promise<any> {
    return { posts: [], total: 0, page: options.page, totalPages: 0 };
  }
  async getPostsCountByStatus(): Promise<any> {
    return { total: 0, published: 0, scheduled: 0, drafts: 0 };
  }
}
