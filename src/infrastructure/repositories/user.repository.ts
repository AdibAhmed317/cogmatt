// Infrastructure Layer - Repository Implementation (Adapter)
// Concrete implementation of domain repository interface

import { User } from '@/domain/entities/UserEntity';

export class UserRepository {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';

  async FindAll(options?: { limit?: number }): Promise<User[]> {
    const res = await fetch(this.apiUrl);

    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = (await res.json()) as Array<any>;

    // Apply limit if provided
    let list = data;
    if (options?.limit !== undefined) {
      const limit = Math.max(0, Math.min(data.length, options.limit));
      list = data.slice(0, limit);
    }

    // Map to domain entities
    return list.map(
      (u) =>
        new User(
          u.id,
          u.name ?? null,
          u.email,
          u.createdAt ? new Date(u.createdAt) : null
        )
    );
  }

  async FindById(id: string): Promise<User | null> {
    const res = await fetch(`${this.apiUrl}/${id}`);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return new User(
      data.id,
      data.name ?? null,
      data.email,
      data.createdAt ? new Date(data.createdAt) : null
    );
  }

  async GetStats(): Promise<{ totalUsers: number; sample: User[] }> {
    const users = await this.FindAll();

    return {
      totalUsers: users.length,
      sample: users.slice(0, 3),
    };
  }
}
