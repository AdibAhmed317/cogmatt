// Domain Entity - Post
export class PostEntity {
  constructor(
    public readonly id: string,
    public readonly agencyId: string,
    public readonly content: string,
    public readonly media: any | null,
    public readonly scheduledAt: Date | null,
    public readonly status: 'pending' | 'posted' | 'failed',
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
