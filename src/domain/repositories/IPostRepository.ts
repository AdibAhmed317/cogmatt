// Domain Layer - Post Repository Interface
import { PostEntity } from '../entities/PostEntity';

export interface IPostRepository {
  createPost(
    agencyId: string,
    content: string,
    media: any | null,
    scheduledAt: Date | null,
    status: 'pending' | 'posted' | 'failed'
  ): Promise<PostEntity>;

  getPostById(id: string): Promise<PostEntity | null>;

  getPostsByAgencyId(agencyId: string): Promise<PostEntity[]>;

  updatePost(
    id: string,
    updates: {
      content?: string;
      media?: any;
      scheduledAt?: Date | null;
      status?: 'pending' | 'posted' | 'failed';
    }
  ): Promise<PostEntity>;

  deletePost(id: string): Promise<void>;

  // For tracking platform-specific status
  createPostPlatformStatus(
    postId: string,
    platformId: string,
    status: 'pending' | 'posted' | 'failed',
    response?: any,
    postedAt?: Date
  ): Promise<void>;

  getPostPlatformStatuses(postId: string): Promise<
    Array<{
      id: string;
      postId: string;
      platformId: string;
      status: string;
      response: any;
      postedAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }>
  >;
}
