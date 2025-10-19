import { createFileRoute } from '@tanstack/react-router';
import StatsCards from '@/components/dashboard/StatsCards';
import PostsTable from '@/components/dashboard/PostsTable';
import AISuggestions from '@/components/dashboard/AISuggestions';
import CalendarView from '@/components/dashboard/CalendarView';

function DashboardIndex() {
  return (
    <div className='space-y-6'>
      <StatsCards />
      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='lg:col-span-2'>
          <PostsTable />
        </div>
      </div>
      <div className='grid gap-6 lg:grid-cols-2'>
        <AISuggestions />
        <CalendarView />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndex,
});
