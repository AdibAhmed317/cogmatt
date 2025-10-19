import { useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import TopBar from './dashboard/TopBar';
import StatsCards from './dashboard/StatsCards';
import PostsTable from './dashboard/PostsTable';
import AISuggestions from './dashboard/AISuggestions';
import CalendarView from './dashboard/CalendarView';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className='min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='flex-1 flex flex-col min-h-screen'>
        <TopBar />
        <main className='flex-1 p-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
          <StatsCards />
          <PostsTable />
          <AISuggestions />
          <CalendarView />
        </main>
      </div>
    </div>
  );
}
