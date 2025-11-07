import { createFileRoute } from '@tanstack/react-router';
import { AgencyController } from '@/presentation/controllers/AgencyController';

const agencyController = new AgencyController();

const honoHandler = async (req: Request) => {
  const url = new URL(req.url);
  const newPath = url.pathname.replace(/^\/api\/agency/, '');
  const rewrittenUrl = new URL(newPath + url.search, url.origin);
  const init: RequestInit = { method: req.method, headers: req.headers };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const body = await req.clone().arrayBuffer();
    init.body = body as any;
  }
  const rewrittenReq = new Request(rewrittenUrl.toString(), init);
  return agencyController.router.fetch(rewrittenReq);
};

export const Route = createFileRoute('/api/agency/$' as any)({
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
    },
  },
});
