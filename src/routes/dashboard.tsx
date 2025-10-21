import { createFileRoute, redirect } from '@tanstack/react-router';
import DashboardLayout from '@/components/DashboardLayout';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    // Use /api/auth/me endpoint for secure auth/role check
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        });
      }

      const user = await res.json();

      // Authorization check - allow both admin and user roles
      if (!user || (user.role !== 'admin' && user.role !== 'user')) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        });
      }

      return { user };
    } catch (error) {
      // If already a redirect, re-throw it
      if (error instanceof Response) throw error;
      // Otherwise redirect to login
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: DashboardLayout,
});
