import { Hono } from 'hono';
import { createFileRoute } from '@tanstack/react-router';
import { fetchAllUsers, fetchUserById, getUserStats } from '@/services/users';

// -----------------------------
// Hono App Definition
// -----------------------------
const app = new Hono();

app.get('/', async (c) => {
  try {
    const limit = Number(c.req.query('limit')) || undefined;
    const users = await fetchAllUsers({ limit });
    return c.json(users);
  } catch (err) {
    return c.json(
      { message: (err as Error).message || 'Failed to fetch users' },
      500
    );
  }
});

app.get('/users-v2', async (c) => {
  try {
    const users = await fetchAllUsers();
    return c.json({ version: 2, count: users.length, data: users });
  } catch (err) {
    return c.json(
      { message: (err as Error).message || 'Failed to fetch users' },
      500
    );
  }
});

app.get('/stats', async (c) => {
  try {
    const stats = await getUserStats();
    return c.json(stats);
  } catch (err) {
    return c.json(
      { message: (err as Error).message || 'Failed to fetch stats' },
      500
    );
  }
});

app.get('/user/:id', async (c) => {
  try {
    const user = await fetchUserById(c.req.param('id'));
    return c.json(user);
  } catch (err) {
    return c.json({ message: (err as Error).message || 'User not found' }, 404);
  }
});

// -----------------------------
// Helper: route request to Hono
// -----------------------------
const honoHandler = async (req: Request) => {
  const url = new URL(req.url);
  // Strip /api/user prefix to get the path Hono expects
  const newPath = url.pathname.replace(/^\/api\/user/, '');
  const rewrittenUrl = new URL(newPath + url.search, url.origin);
  const rewrittenReq = new Request(rewrittenUrl, req);
  return app.fetch(rewrittenReq);
};

// -----------------------------
// TanStack Route Bridge
// -----------------------------
export const Route = createFileRoute('/api/user/$' as any)({
  server: {
    handlers: {
      GET: async ({ request }) => honoHandler(request),
      POST: async ({ request }) => honoHandler(request),
      PUT: async ({ request }) => honoHandler(request),
      DELETE: async ({ request }) => honoHandler(request),
    },
  },
});
