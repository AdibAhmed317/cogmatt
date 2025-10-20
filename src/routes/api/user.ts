import { createFileRoute } from '@tanstack/react-router';
import { UserController } from '@/presentation/controllers/UserController';

// -----------------------------
// Helper: route request to Hono
// -----------------------------
const userController = new UserController();
const honoHandler = async (req: Request) => {
  const url = new URL(req.url);
  // Strip /api/user prefix to get the path Hono expects
  const newPath = url.pathname.replace(/^\/api\/user/, '');
  const rewrittenUrl = new URL(newPath + url.search, url.origin);
  const rewrittenReq = new Request(rewrittenUrl, req);
  return userController.router.fetch(rewrittenReq);
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
