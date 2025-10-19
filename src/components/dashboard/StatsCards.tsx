import { BarChart3, BarChart, Calendar, Zap } from 'lucide-react';

export default function StatsCards() {
  return (
    <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8'>
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center'>
        <BarChart3 className='mb-2 h-8 w-8 text-blue-500 dark:text-blue-400' />
        <div className='text-2xl font-bold text-slate-900 dark:text-white'>
          128
        </div>
        <div className='text-sm text-slate-600 dark:text-slate-400'>
          Posts This Month
        </div>
      </div>
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center'>
        <BarChart className='mb-2 h-8 w-8 text-indigo-500 dark:text-indigo-400' />
        <div className='text-2xl font-bold text-slate-900 dark:text-white'>
          7.2%
        </div>
        <div className='text-sm text-slate-600 dark:text-slate-400'>
          Engagement Rate
        </div>
      </div>
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center'>
        <Calendar className='mb-2 h-8 w-8 text-violet-500 dark:text-violet-400' />
        <div className='text-2xl font-bold text-slate-900 dark:text-white'>
          14
        </div>
        <div className='text-sm text-slate-600 dark:text-slate-400'>
          Scheduled Posts
        </div>
      </div>
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center'>
        <Zap className='mb-2 h-8 w-8 text-yellow-500 dark:text-yellow-400' />
        <div className='text-2xl font-bold text-slate-900 dark:text-white'>
          5
        </div>
        <div className='text-sm text-slate-600 dark:text-slate-400'>
          AI Suggestions
        </div>
      </div>
    </div>
  );
}
