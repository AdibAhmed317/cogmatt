import { createFileRoute } from '@tanstack/react-router';
import { AuthController } from '@/presentation/controllers/AuthController';

// -----------------------------
// Helper: route request to Hono
// -----------------------------
const authController = new AuthController();
const honoHandler = async (req: Request) => {
  const url = new URL(req.url);
  // Strip /api/auth prefix to get the path Hono expects
  const newPath = url.pathname.replace(/^\/api\/auth/, '');
  const rewrittenUrl = new URL(newPath + url.search, url.origin);
  const rewrittenReq = new Request(rewrittenUrl, req);
  return authController.router.fetch(rewrittenReq);
};

// -----------------------------
// TanStack Route Bridge
// -----------------------------
export const Route = createFileRoute('/api/auth/$' as any)({
  server: {
    handlers: {
      GET: async ({ request }) => honoHandler(request),
      POST: async ({ request }) => honoHandler(request),
      PUT: async ({ request }) => honoHandler(request),
      DELETE: async ({ request }) => honoHandler(request),
    },
  },
});
