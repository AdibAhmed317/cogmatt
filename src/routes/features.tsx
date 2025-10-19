import { createFileRoute } from '@tanstack/react-router';
import FeaturesPage from '@/components/FeaturesPage';

export const Route = createFileRoute('/features')({
  component: FeaturesPage,
});
