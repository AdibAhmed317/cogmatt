import { createFileRoute } from '@tanstack/react-router';
import SettingsPage from '@/components/dashboard/pages/SettingsPage';

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
});
