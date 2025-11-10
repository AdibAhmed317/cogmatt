// Presentation Layer - Post Controller
import { Context, Hono } from 'hono';
import { PostService } from '@/application/services/PostService';
import { PostRepository } from '@/infrastructure/repositories/PostRepository';
import { SocialAccountRepository } from '@/infrastructure/repositories/SocialAccountRepository';
import { CreatePostDTO } from '@/application/dtos/PostDTO';
import { getCookie } from 'hono/cookie';
import { AuthService } from '@/application/services/AuthService';

export class PostController {
  public router = new Hono();
  private postService: PostService;
  private authService: AuthService;

  constructor() {
    const postRepo = new PostRepository();
    const socialAccountRepo = new SocialAccountRepository();

    this.postService = new PostService(postRepo, socialAccountRepo);
    this.authService = new AuthService();

    this.initRoutes();
  }

  private initRoutes() {
    // Create and optionally publish a post
    this.router.post('/create', (c) => this.createPost(c));

    // Get post by ID
    this.router.get('/:id', (c) => this.getPost(c));

    // Get all posts for an agency
    this.router.get('/agency/:agencyId', (c) => this.getAgencyPosts(c));

    // Delete a post
    this.router.delete('/:id', (c) => this.deletePost(c));

    // Debug: Test Facebook token
    this.router.post('/test-facebook-token', (c) => this.testFacebookToken(c));
  }

  /**
   * POST /api/posts/create
   * Create a new post and optionally publish it immediately
   */
  async createPost(c: Context) {
    try {
      // Verify authentication
      const accessToken = getCookie(c, 'accessToken');
      if (!accessToken) {
        return c.json({ message: 'Unauthorized' }, 401);
      }

      const payload = this.authService.verifyAccessToken(accessToken);
      if (!payload) {
        return c.json({ message: 'Invalid token' }, 401);
      }

      const body = await c.req.json();

      // Validate required fields
      if (!body.agencyId || !body.content || !body.socialAccountIds) {
        return c.json(
          {
            message:
              'Missing required fields: agencyId, content, socialAccountIds',
          },
          400
        );
      }

      const dto: CreatePostDTO = {
        agencyId: body.agencyId,
        content: body.content,
        media: body.media,
        scheduledAt: body.scheduledAt,
        socialAccountIds: body.socialAccountIds,
      };

      const publishNow = body.publishNow === true;

      const result = await this.postService.createPost(dto, publishNow);

      return c.json({
        message: publishNow
          ? 'Post published successfully'
          : 'Post created successfully',
        ...result,
      });
    } catch (error) {
      console.error('Error creating post:', error);
      return c.json(
        {
          message: (error as Error).message || 'Failed to create post',
        },
        400
      );
    }
  }

  /**
   * GET /api/posts/:id
   * Get a post by ID with platform statuses
   */
  async getPost(c: Context) {
    try {
      const postId = c.req.param('id');
      if (!postId) {
        return c.json({ message: 'Post ID required' }, 400);
      }

      const post = await this.postService.getPostWithStatuses(postId);
      return c.json(post);
    } catch (error) {
      console.error('Error getting post:', error);
      return c.json(
        {
          message: (error as Error).message || 'Failed to get post',
        },
        404
      );
    }
  }

  /**
   * GET /api/posts/agency/:agencyId
   * Get all posts for an agency
   */
  async getAgencyPosts(c: Context) {
    try {
      const agencyId = c.req.param('agencyId');
      if (!agencyId) {
        return c.json({ message: 'Agency ID required' }, 400);
      }

      const posts = await this.postService.getAgencyPosts(agencyId);
      return c.json({ posts });
    } catch (error) {
      console.error('Error getting agency posts:', error);
      return c.json(
        {
          message: (error as Error).message || 'Failed to get posts',
        },
        400
      );
    }
  }

  /**
   * DELETE /api/posts/:id
   * Delete a post
   */
  async deletePost(c: Context) {
    try {
      // Verify authentication
      const accessToken = getCookie(c, 'accessToken');
      if (!accessToken) {
        return c.json({ message: 'Unauthorized' }, 401);
      }

      const postId = c.req.param('id');
      if (!postId) {
        return c.json({ message: 'Post ID required' }, 400);
      }

      await this.postService.deletePost(postId);
      return c.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return c.json(
        {
          message: (error as Error).message || 'Failed to delete post',
        },
        400
      );
    }
  }

  /**
   * POST /api/posts/test-facebook-token
   * Test if a Facebook token has the required permissions
   */
  async testFacebookToken(c: Context) {
    try {
      const body = await c.req.json();
      const { pageId, accessToken } = body;

      if (!pageId || !accessToken) {
        return c.json({ message: 'pageId and accessToken required' }, 400);
      }

      // Test 1: Get page info
      const pageInfoRes = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?fields=id,name,access_token&access_token=${accessToken}`
      );
      const pageInfo = await pageInfoRes.json();

      // Test 2: Check permissions
      const permissionsRes = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/permissions?access_token=${accessToken}`
      );
      const permissionsData = await permissionsRes.json();

      return c.json({
        pageInfo,
        permissions: permissionsData,
        canPost:
          pageInfoRes.ok &&
          permissionsData.data?.some(
            (p: any) =>
              p.permission === 'pages_manage_posts' && p.status === 'granted'
          ),
      });
    } catch (error) {
      console.error('Error testing Facebook token:', error);
      return c.json(
        {
          message: (error as Error).message || 'Failed to test token',
        },
        400
      );
    }
  }
}
