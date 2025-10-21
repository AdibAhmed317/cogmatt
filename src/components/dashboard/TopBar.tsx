import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/presentation/contexts/AuthContext';

export default function TopBar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: '/login' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className='flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'>
      <div className='flex items-center gap-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
          <input
            type='text'
            placeholder='Search posts, templates...'
            className='w-64 rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
          />
        </div>
      </div>
      <div className='flex items-center gap-6'>
        <ThemeToggle />
        <button className='relative'>
          <Bell className='h-6 w-6 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400' />
          <span className='absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500'></span>
        </button>
        <div className='relative'>
          <div
            className='flex items-center gap-2 cursor-pointer hover:opacity-80'
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <UserCircle className='h-8 w-8 text-slate-400' />
            <span className='hidden md:inline text-slate-700 dark:text-slate-300 font-medium'>
              {user?.email?.split('@')[0] || 'User'}
            </span>
          </div>

          {showUserMenu && (
            <div className='absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 z-50'>
              <div className='p-3 border-b border-slate-200 dark:border-slate-700'>
                <p className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                  {user?.email}
                </p>
                <p className='text-xs text-slate-500 dark:text-slate-400 capitalize'>
                  {user?.role || 'User'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
              >
                <LogOut className='h-4 w-4' />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
