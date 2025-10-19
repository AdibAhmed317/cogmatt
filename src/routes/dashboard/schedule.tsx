import { createFileRoute } from '@tanstack/react-router';
import SchedulePage from '@/components/dashboard/pages/SchedulePage';

export const Route = createFileRoute('/dashboard/schedule')({
  component: SchedulePage,
});
