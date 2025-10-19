import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import CalendarView from '../CalendarView';

export default function SchedulePage() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-white'>
            Schedule
          </h1>
          <p className='text-slate-600 dark:text-slate-400 mt-1'>
            Plan and schedule your content calendar
          </p>
        </div>
        <button className='flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl whitespace-nowrap'>
          <Calendar className='h-5 w-5' />
          Schedule Post
        </button>
      </div>

      <div className='grid gap-6 lg:grid-cols-4'>
        {/* Left Sidebar - Stats & Upcoming */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Stats */}
          <div className='space-y-3'>
            <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                This Week
              </div>
              <div className='text-2xl font-bold text-slate-900 dark:text-white mt-1'>
                12
              </div>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                This Month
              </div>
              <div className='text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1'>
                42
              </div>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                Next Month
              </div>
              <div className='text-2xl font-bold text-violet-600 dark:text-violet-400 mt-1'>
                28
              </div>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                Unscheduled
              </div>
              <div className='text-2xl font-bold text-slate-600 dark:text-slate-400 mt-1'>
                8
              </div>
            </div>
          </div>

          {/* Upcoming Posts */}
          <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
            <h3 className='font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              Upcoming
            </h3>
            <div className='space-y-3'>
              {[
                { time: 'Today 2:00 PM', title: 'Product launch post' },
                { time: 'Tomorrow 10:00 AM', title: 'Weekly newsletter' },
                { time: 'Oct 22, 4:30 PM', title: 'Customer spotlight' },
              ].map((post, idx) => (
                <div key={idx} className='text-sm'>
                  <p className='font-medium text-slate-900 dark:text-white'>
                    {post.title}
                  </p>
                  <p className='text-slate-500 dark:text-slate-400 text-xs mt-1'>
                    {post.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Calendar */}
        <div className='lg:col-span-3 space-y-4'>
          {/* Calendar Controls */}
          <div className='flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
            <button className='flex items-center gap-2 rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'>
              <ChevronLeft className='h-5 w-5' />
              Previous
            </button>
            <div className='text-lg font-semibold text-slate-900 dark:text-white'>
              October 2025
            </div>
            <button className='flex items-center gap-2 rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'>
              Next
              <ChevronRight className='h-5 w-5' />
            </button>
          </div>

          {/* Calendar View */}
          <CalendarView />
        </div>
      </div>
    </div>
  );
}
