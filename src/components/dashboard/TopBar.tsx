import { Bell, Search, UserCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function TopBar() {
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
        <div className='flex items-center gap-2 cursor-pointer'>
          <UserCircle className='h-8 w-8 text-slate-400' />
          <span className='hidden md:inline text-slate-700 dark:text-slate-300 font-medium'>
            Alex
          </span>
        </div>
      </div>
    </header>
  );
}
