import { User } from '@/domain/entities/UserEntity';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';

export class UserService {
  private userRepo: UserRepository;
  constructor() {
    this.userRepo = new UserRepository();
  }

  async GetAllUsers(options?: { limit?: number }): Promise<User[]> {
    return this.userRepo.FindAll(options);
  }

  async GetUserById(id: string): Promise<User | null> {
    return this.userRepo.FindById(id);
  }

  async GetUserStats() {
    return this.userRepo.GetStats();
  }
}
