// Domain Layer - Repository Interface (Port)
// Defines contract without implementation details

import { User } from '../entities/UserEntity';

export interface UserListOptions {
  limit?: number;
}

export interface IUserRepository {
  FindAll(options?: UserListOptions): Promise<User[]>;
  FindById(id: string): Promise<User | null>;
  GetStats(): Promise<{ totalUsers: number; sample: User[] }>;
}
