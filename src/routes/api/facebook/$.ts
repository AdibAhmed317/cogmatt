import { createFileRoute } from '@tanstack/react-router';
import { FacebookController } from '@/presentation/controllers/FacebookController';

// -----------------------------
// Helper: route request to Hono
// -----------------------------
const facebookController = new FacebookController();
const honoHandler = async (req: Request) => {
  const url = new URL(req.url);
  // Strip /api/facebook prefix to get the path Hono expects
  const newPath = url.pathname.replace(/^\/api\/facebook/, '');
  const rewrittenUrl = new URL(newPath + url.search, url.origin);

  // Clone the incoming request and forward method/headers/body
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
  return facebookController.router.fetch(rewrittenReq);
};

// -----------------------------
// TanStack Route Bridge
// -----------------------------
export const Route = createFileRoute('/api/facebook/$' as any)({
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
