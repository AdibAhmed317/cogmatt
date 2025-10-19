import { createFileRoute } from '@tanstack/react-router';
import SignupPage from '@/components/SignupPage';

export const Route = createFileRoute('/signup')({
  component: SignupPage,
});
