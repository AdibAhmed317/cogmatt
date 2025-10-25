import { useEffect, useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/presentation/contexts/AuthContext';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();

  // Ensure user is authenticated on the client; redirect to login if not
  useEffect(() => {
    // On first mount, ensure we have the freshest auth state
    checkAuth().catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Avoid flashing the dashboard while auth is loading or unauthenticated
  if (isLoading || !isAuthenticated) {
    return null; // render nothing until authenticated to prevent UI flash
  }

  return (
    <div className='min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='flex-1 flex flex-col min-h-screen'>
        <TopBar />
        <main className='flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
          <div className='max-w-7xl mx-auto'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
