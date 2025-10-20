// Domain Entity - Core business object
// No dependencies on external libraries or frameworks

// Domain Entity for User (class-based)
export class User {
  constructor(
    public readonly id: number,
    public readonly name: string | null,
    public readonly email: string,
    public readonly createdAt: Date | null
  ) {}
}
