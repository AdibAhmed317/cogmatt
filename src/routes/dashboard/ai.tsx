import { createFileRoute } from '@tanstack/react-router';
import AIPage from '@/components/dashboard/pages/AIPage';

export const Route = createFileRoute('/dashboard/ai')({
  component: AIPage,
});
