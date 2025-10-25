// Domain Entity - Core business object
// No dependencies on external libraries or frameworks

// Domain Entity for User (class-based)
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string | null,
    public readonly googleId: string | null,
    public readonly authProvider: string,
    public readonly role: string,
    public readonly emailVerified: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
