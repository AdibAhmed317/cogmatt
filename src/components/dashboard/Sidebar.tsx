import {
  ChevronLeft,
  ChevronRight,
  Home,
  FileText,
  Calendar,
  Zap,
  BarChart,
  Settings,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import logoUrl from '@/assets/logo.png?url';

const navLinks = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Posts', href: '/dashboard/posts', icon: FileText },
  { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  { name: 'AI', href: '/dashboard/ai', icon: Zap },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  return (
    <aside
      className={`flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} min-h-screen`}
    >
      <div className='flex items-center gap-2 px-6 py-6'>
        <img
          src={logoUrl}
          alt='Cogmatt logo'
          className='h-7 w-7 rounded-lg object-contain'
        />
        {sidebarOpen && (
          <span className='text-xl font-bold text-slate-900 dark:text-white'>
            Cogmatt
          </span>
        )}
      </div>
      <nav className='flex-1 px-2'>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.href}
              className='flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 font-medium transition-all'
              activeProps={{
                className:
                  'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400',
              }}
              activeOptions={{
                exact: link.href === '/dashboard',
              }}
            >
              <Icon className='h-5 w-5' />
              {sidebarOpen && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>
      <button
        className='flex items-center justify-center px-4 py-3 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400'
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <ChevronLeft className='h-5 w-5' />
        ) : (
          <ChevronRight className='h-5 w-5' />
        )}
      </button>
    </aside>
  );
}
