// API Routes - Posts
import { createFileRoute } from '@tanstack/react-router';
import { PostController } from '@/presentation/controllers/PostController';

// -----------------------------
// Helper: route request to Hono
// -----------------------------
const postController = new PostController();
const honoHandler = async (req: Request) => {
  const url = new URL(req.url);
  // Strip /api/posts prefix to get the path Hono expects
  const newPath = url.pathname.replace(/^\/api\/posts/, '');
  const rewrittenUrl = new URL(newPath + url.search, url.origin);

  // Clone the incoming request and forward method/headers/body so cookies are preserved
  const init: RequestInit = {
    method: req.method,
    headers: req.headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // Clone body for non-GET/HEAD
    const body = await req.clone().arrayBuffer();
    init.body = body as any;
  }

  const rewrittenReq = new Request(rewrittenUrl.toString(), init);
  return postController.router.fetch(rewrittenReq);
};

// -----------------------------
// TanStack Route Bridge
// -----------------------------
export const Route = createFileRoute('/api/posts/$' as any)({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const response = await honoHandler(request);
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      },
      POST: async ({ request }) => {
        const response = await honoHandler(request);
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      },
      PUT: async ({ request }) => {
        const response = await honoHandler(request);
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      },
      DELETE: async ({ request }) => {
        const response = await honoHandler(request);
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      },
    },
  },
});
