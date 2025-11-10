// Infrastructure Layer - Post Repository Implementation
import { db } from '../database/drizzle';
import { posts, postPlatformStatus } from '../database/schema';
import { eq } from 'drizzle-orm';
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { PostEntity } from '@/domain/entities/PostEntity';

export class PostRepository implements IPostRepository {
  async createPost(
    agencyId: string,
    content: string,
    media: any | null,
    scheduledAt: Date | null,
    status: 'pending' | 'posted' | 'failed'
  ): Promise<PostEntity> {
    const [post] = await db
      .insert(posts)
      .values({
        agencyId,
        content,
        media,
        scheduledAt,
        status,
      })
      .returning();

    return new PostEntity(
      post.id,
      post.agencyId,
      post.content,
      post.media,
      post.scheduledAt,
      post.status,
      post.createdAt,
      post.updatedAt
    );
  }

  async getPostById(id: string): Promise<PostEntity | null> {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) return null;

    return new PostEntity(
      post.id,
      post.agencyId,
      post.content,
      post.media,
      post.scheduledAt,
      post.status,
      post.createdAt,
      post.updatedAt
    );
  }

  async getPostsByAgencyId(agencyId: string): Promise<PostEntity[]> {
    const postList = await db
      .select()
      .from(posts)
      .where(eq(posts.agencyId, agencyId));

    return postList.map(
      (post) =>
        new PostEntity(
          post.id,
          post.agencyId,
          post.content,
          post.media,
          post.scheduledAt,
          post.status,
          post.createdAt,
          post.updatedAt
        )
    );
  }

  async updatePost(
    id: string,
    updates: {
      content?: string;
      media?: any;
      scheduledAt?: Date | null;
      status?: 'pending' | 'posted' | 'failed';
    }
  ): Promise<PostEntity> {
    const [post] = await db
      .update(posts)
      .set(updates)
      .where(eq(posts.id, id))
      .returning();

    return new PostEntity(
      post.id,
      post.agencyId,
      post.content,
      post.media,
      post.scheduledAt,
      post.status,
      post.createdAt,
      post.updatedAt
    );
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async createPostPlatformStatus(
    postId: string,
    platformId: string,
    status: 'pending' | 'posted' | 'failed',
    response?: any,
    postedAt?: Date
  ): Promise<void> {
    await db.insert(postPlatformStatus).values({
      postId,
      platformId,
      status,
      response: response || null,
      postedAt: postedAt || null,
    });
  }

  async getPostPlatformStatuses(postId: string): Promise<
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
  > {
    const statuses = await db
      .select()
      .from(postPlatformStatus)
      .where(eq(postPlatformStatus.postId, postId));

    return statuses;
  }
}
