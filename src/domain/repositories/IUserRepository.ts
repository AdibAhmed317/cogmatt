// Domain Layer - Repository Interface (Port)
// Defines contract without implementation details

import { User } from '../entities/UserEntity';

export interface UserListOptions {
  limit?: number;
}

export interface IUserRepository {
  findAll(options?: UserListOptions): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  getStats(): Promise<{ totalUsers: number; sample: User[] }>;
}
