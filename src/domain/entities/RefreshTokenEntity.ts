// Domain Entity - RefreshToken
// No dependencies on external libraries or frameworks

export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date
  ) {}
}
