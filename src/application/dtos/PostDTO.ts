// Application Layer - Post DTOs

export interface CreatePostDTO {
  agencyId: string;
  content: string;
  media?: any;
  scheduledAt?: string; // ISO date string
  socialAccountIds: string[]; // IDs of social accounts to post to
}

export interface UpdatePostDTO {
  content?: string;
  media?: any;
  scheduledAt?: string;
  status?: 'pending' | 'posted' | 'failed';
}

export interface PostResponseDTO {
  id: string;
  agencyId: string;
  content: string;
  media: any | null;
  scheduledAt: Date | null;
  status: 'pending' | 'posted' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  platforms?: {
    platformId: string;
    platformName: string;
    status: string;
    postedAt: Date | null;
  }[];
}

export interface PublishPostResponseDTO {
  postId: string;
  status: 'success' | 'partial' | 'failed';
  results: {
    socialAccountId: string;
    platformName: string;
    success: boolean;
    externalPostId?: string;
    error?: string;
  }[];
}
