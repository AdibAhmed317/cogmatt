export interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  full_picture?: string;
  attachments?: {
    data: Array<{
      type: string;
      media?: {
        image?: { src: string };
      };
      subattachments?: {
        data: Array<{
          media?: {
            image?: { src: string };
          };
        }>;
      };
    }>;
  };
  reactions?: {
    summary: { total_count: number };
  };
  comments?: {
    summary: { total_count: number };
  };
  shares?: {
    count: number;
  };
  is_published: boolean;
  scheduled_publish_time?: number;
}

export interface FacebookPagePost {
  id: string;
  content: string;
  createdAt: Date;
  scheduledAt: Date | null;
  status: 'published' | 'scheduled';
  platforms: Array<{ id: string; name: string }>;
  media?: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  facebookId: string;
}

export class FacebookService {
  private static GRAPH_API_BASE = 'https://graph.facebook.com/v21.0';

  /**
   * Fetch posts from a Facebook page
   * @param pageId - Facebook Page ID
   * @param accessToken - Page access token
   * @param limit - Number of posts to fetch (default: 25)
   */
  static async getPagePosts(
    pageId: string,
    accessToken: string,
    limit: number = 25
  ): Promise<FacebookPagePost[]> {
    try {
      // Basic fields that don't require special permissions
      const fields = [
        'id',
        'message',
        'story',
        'created_time',
        'full_picture',
        'attachments{type,media,subattachments}',
        'is_published',
        'scheduled_publish_time',
      ].join(',');

      // Use 'published_posts' endpoint for more reliable results
      const url = `${this.GRAPH_API_BASE}/${pageId}/published_posts?fields=${fields}&limit=${limit}&access_token=${accessToken}`;

      console.log(
        '[FacebookService] Fetching from URL (token hidden):',
        url.replace(accessToken, 'HIDDEN')
      );

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Facebook API Error: ${error.error?.message || 'Unknown error'}`
        );
      }

      const data = await response.json();
      console.log(
        '[FacebookService] Raw Facebook response:',
        JSON.stringify(data, null, 2)
      );
      const posts: FacebookPost[] = data.data || [];
      console.log(
        '[FacebookService] Number of posts from Facebook:',
        posts.length
      );

      // Try to fetch engagement data for each post separately (best effort)
      const postsWithEngagement = await Promise.all(
        posts.map(async (post) => {
          try {
            // Try to fetch engagement data separately
            const engagementUrl = `${this.GRAPH_API_BASE}/${post.id}?fields=reactions.summary(total_count),comments.summary(total_count),shares&access_token=${accessToken}`;
            const engagementRes = await fetch(engagementUrl);
            
            if (engagementRes.ok) {
              const engagementData = await engagementRes.json();
              return {
                ...post,
                reactions: engagementData.reactions,
                comments: engagementData.comments,
                shares: engagementData.shares,
              };
            }
          } catch (error) {
            console.log('[FacebookService] Could not fetch engagement for post:', post.id);
          }
          return post;
        })
      );

      // Transform Facebook posts to our format
      const transformed = postsWithEngagement.map((post) => this.transformFacebookPost(post));
      console.log(
        '[FacebookService] Number of transformed posts:',
        transformed.length
      );
      console.log('[FacebookService] All transformed posts:', transformed);

      return transformed;
    } catch (error) {
      console.error('Error fetching Facebook posts:', error);
      throw error;
    }
  }

  /**
   * Transform Facebook API post to our application format
   */
  private static transformFacebookPost(post: FacebookPost): FacebookPagePost {
    // Handle posts with no text content (e.g., photo-only posts)
    const content = post.message || post.story || '[Media post with no text]';
    const createdTime = new Date(post.created_time);
    const isScheduled = !post.is_published && !!post.scheduled_publish_time;
    const scheduledAt = post.scheduled_publish_time
      ? new Date(post.scheduled_publish_time * 1000)
      : null;

    // Extract media URLs
    const media: string[] = [];
    if (post.full_picture) {
      media.push(post.full_picture);
    }
    if (post.attachments?.data) {
      post.attachments.data.forEach((attachment) => {
        if (attachment.media?.image?.src) {
          media.push(attachment.media.image.src);
        }
        if (attachment.subattachments?.data) {
          attachment.subattachments.data.forEach((sub) => {
            if (sub.media?.image?.src) {
              media.push(sub.media.image.src);
            }
          });
        }
      });
    }

    console.log('[FacebookService] Transformed post:', {
      id: post.id,
      content,
      hasMessage: !!post.message,
      hasStory: !!post.story,
      engagement: {
        reactions: post.reactions?.summary?.total_count,
        comments: post.comments?.summary?.total_count,
        shares: post.shares?.count,
      },
    });

    return {
      id: post.id,
      content,
      createdAt: createdTime,
      scheduledAt: isScheduled ? scheduledAt : null,
      status: isScheduled ? 'scheduled' : 'published',
      platforms: [{ id: 'facebook', name: 'Facebook' }],
      media: media.length > 0 ? media : undefined,
      engagement: {
        likes: post.reactions?.summary?.total_count || 0,
        comments: post.comments?.summary?.total_count || 0,
        shares: post.shares?.count || 0,
      },
      facebookId: post.id,
    };
  }

  /**
   * Get posts from all connected Facebook accounts for an agency
   * This method should be called from the backend where we have access to tokens
   */
  static async getAgencyFacebookPosts(
    agencyId: string,
    accountsWithTokens: Array<{
      accountId: string;
      accessToken: string;
      username: string;
    }>
  ): Promise<FacebookPagePost[]> {
    try {
      console.log('[FacebookService] Fetching posts for agency:', agencyId);
      console.log(
        '[FacebookService] Facebook accounts found:',
        accountsWithTokens.length
      );

      if (accountsWithTokens.length === 0) {
        console.log('[FacebookService] No Facebook accounts connected');
        return [];
      }

      // Fetch posts from all Facebook pages
      const allPosts: FacebookPagePost[] = [];

      for (const account of accountsWithTokens) {
        try {
          console.log(
            `[FacebookService] Fetching posts for page: ${account.username} (ID: ${account.accountId})`
          );
          const posts = await this.getPagePosts(
            account.accountId,
            account.accessToken,
            25
          );
          console.log(
            `[FacebookService] Fetched ${posts.length} posts from ${account.username}`
          );
          allPosts.push(...posts);
        } catch (error) {
          console.error(
            `[FacebookService] Error fetching posts for page ${account.username}:`,
            error
          );
          // Continue with other accounts even if one fails
        }
      }

      // Sort by creation date (newest first)
      allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      console.log('[FacebookService] Total posts fetched:', allPosts.length);
      return allPosts;
    } catch (error) {
      console.error(
        '[FacebookService] Error fetching agency Facebook posts:',
        error
      );
      throw error;
    }
  }

  /**
   * Publish a post to a Facebook page
   * @param pageId - Facebook Page ID
   * @param accessToken - Page access token
   * @param message - Post content/message
   * @param scheduledPublishTime - Optional Unix timestamp for scheduling (future time)
   * @param published - Whether to publish immediately (default: true)
   */
  static async publishPost(
    pageId: string,
    accessToken: string,
    message: string,
    scheduledPublishTime?: number,
    published: boolean = true
  ): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      const url = `${this.GRAPH_API_BASE}/${pageId}/feed`;

      const body: any = {
        message,
        access_token: accessToken,
        published: published ? 'true' : 'false',
      };

      // If scheduling, add the scheduled_publish_time
      if (scheduledPublishTime) {
        body.scheduled_publish_time = scheduledPublishTime;
        body.published = 'false'; // Must be false when scheduling
      }

      console.log('[FacebookService] Publishing to Facebook:', {
        pageId,
        messagePreview: message.substring(0, 50),
        scheduled: !!scheduledPublishTime,
        scheduledTime: scheduledPublishTime
          ? new Date(scheduledPublishTime * 1000).toISOString()
          : null,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        console.error('[FacebookService] Facebook API error:', data.error);
        return {
          success: false,
          error: data.error?.message || 'Failed to publish to Facebook',
        };
      }

      console.log(
        '[FacebookService] Successfully published to Facebook:',
        data.id
      );

      return {
        success: true,
        postId: data.id,
      };
    } catch (error) {
      console.error('[FacebookService] Error publishing to Facebook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
