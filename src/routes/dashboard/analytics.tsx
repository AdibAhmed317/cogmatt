import { createFileRoute } from '@tanstack/react-router';
import AnalyticsPage from '@/components/dashboard/pages/AnalyticsPage';

export const Route = createFileRoute('/dashboard/analytics')({
  component: AnalyticsPage,
});
