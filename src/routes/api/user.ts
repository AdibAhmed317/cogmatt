import { Hono } from 'hono';
import { createFileRoute } from '@tanstack/react-router';
import { fetchAllUsers, fetchUserById, getUserStats } from '@/services/users';

const app = new Hono();

// GET /api/hono/users
app.get('/', async (c) => {
  try {
    const limitRaw = c.req.query('limit');
    const limitNum = limitRaw ? Number(limitRaw) : undefined;
    const users = await fetchAllUsers({ limit: limitNum });
    return c.json(users);
  } catch (error) {
    return c.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to fetch users',
      },
      { status: 500 as any }
    );
  }
});

// GET /api/hono/users-v2
app.get('/users-v2', async (c) => {
  try {
    const users = await fetchAllUsers();
    return c.json({ version: 2, count: users.length, data: users });
  } catch (error) {
    return c.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to fetch users',
      },
      { status: 500 as any }
    );
  }
});

// GET /api/hono/stats
app.get('/stats', async (c) => {
  try {
    const stats = await getUserStats();
    return c.json(stats);
  } catch (error) {
    return c.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to fetch stats',
      },
      { status: 500 as any }
    );
  }
});

// GET /api/hono/user/:id
app.get('/user/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const user = await fetchUserById(id);
    return c.json(user);
  } catch (error) {
    return c.json(
      { message: error instanceof Error ? error.message : 'User not found' },
      { status: 404 as any }
    );
  }
});

export const Route = createFileRoute('/api/user/$' as any)({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Rewrite the URL to remove /api/hono prefix so Hono routes match
        const url = new URL(request.url);
        const newPath = url.pathname.replace('/api/hono', '');
        const newUrl = new URL(newPath + url.search, url.origin);
        const newRequest = new Request(newUrl, request);
        return app.fetch(newRequest);
      },
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const newPath = url.pathname.replace('/api/hono', '');
        const newUrl = new URL(newPath + url.search, url.origin);
        const newRequest = new Request(newUrl, request);
        return app.fetch(newRequest);
      },
      PUT: async ({ request }) => {
        const url = new URL(request.url);
        const newPath = url.pathname.replace('/api/hono', '');
        const newUrl = new URL(newPath + url.search, url.origin);
        const newRequest = new Request(newUrl, request);
        return app.fetch(newRequest);
      },
      DELETE: async ({ request }) => {
        const url = new URL(request.url);
        const newPath = url.pathname.replace('/api/hono', '');
        const newUrl = new URL(newPath + url.search, url.origin);
        const newRequest = new Request(newUrl, request);
        return app.fetch(newRequest);
      },
    },
  },
});
