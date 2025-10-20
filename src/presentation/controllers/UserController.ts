// Presentation Layer - Controller
// Handles HTTP requests/responses

import { Hono } from 'hono';
import { UserService } from '@/application/services/UserService';

// Create Hono app and controller class
export class UserController {
  public router = new Hono();
  private userService = new UserService();

  constructor() {
    // GET / - List all users with optional limit
    this.router.get('/', async (c) => {
      try {
        const limit = Number(c.req.query('limit')) || undefined;
        const users = await this.userService.GetAllUsers({ limit });
        return c.json(users);
      } catch (err) {
        return c.json(
          { message: (err as Error).message || 'Failed to fetch users' },
          500
        );
      }
    });

    // GET /users-v2 - List users with version 2 format
    this.router.get('/users-v2', async (c) => {
      try {
        const users = await this.userService.GetAllUsers();
        return c.json({ version: 2, count: users.length, data: users });
      } catch (err) {
        return c.json(
          { message: (err as Error).message || 'Failed to fetch users' },
          500
        );
      }
    });

    // GET /stats - Get user statistics
    this.router.get('/stats', async (c) => {
      try {
        const stats = await this.userService.GetUserStats();
        return c.json(stats);
      } catch (err) {
        return c.json(
          { message: (err as Error).message || 'Failed to fetch stats' },
          500
        );
      }
    });

    // GET /user/:id - Get single user by ID
    this.router.get('/user/:id', async (c) => {
      try {
        const user = await this.userService.GetUserById(c.req.param('id'));
        return c.json(user);
      } catch (err) {
        return c.json(
          { message: (err as Error).message || 'User not found' },
          404
        );
      }
    });
  }
}
