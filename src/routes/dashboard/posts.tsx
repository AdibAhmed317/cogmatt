import { createFileRoute } from '@tanstack/react-router';
import PostsPage from '@/components/dashboard/pages/PostsPage';

export const Route = createFileRoute('/dashboard/posts')({
  component: PostsPage,
});
