import { createFileRoute } from '@tanstack/react-router';
import PricingPage from '../components/PricingPage';

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
});
