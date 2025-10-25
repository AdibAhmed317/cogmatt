import { createFileRoute, redirect } from '@tanstack/react-router';
import DashboardLayout from '@/components/DashboardLayout';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    // If running on the server (during SSR), skip auth check here.
    // Server-side fetch won't have the user's browser cookies and can cause false 401s.
    if (typeof window === 'undefined') {
      return {} as any;
    }
    // Use /api/auth/me endpoint for secure auth/role check
    // Add a small retry to handle the tiny race after OAuth callback
    const tryGetUser = async () => {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return null;
      try {
        return await res.json();
      } catch {
        return null;
      }
    };

    let user = await tryGetUser();
    if (!user) {
      // brief backoff to allow cookies to be stored
      await new Promise((r) => setTimeout(r, 250));
      user = await tryGetUser();
    }

    // Authorization check - allow both admin and user roles
    if (!user || (user.role !== 'admin' && user.role !== 'user')) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }

    return { user };
  },
  component: DashboardLayout,
});
