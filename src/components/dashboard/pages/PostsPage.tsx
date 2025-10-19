import { Plus, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PostsTable from '../PostsTable';

export default function PostsPage() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-white'>
            Posts
          </h1>
          <p className='text-slate-600 dark:text-slate-400 mt-1'>
            Manage all your social media posts
          </p>
        </div>
        <button className='flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl whitespace-nowrap'>
          <Plus className='h-5 w-5' />
          Create Post
        </button>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Left Column - Stats & Filters */}
        <div className='space-y-6 lg:col-span-1'>
          {/* Stats */}
          <div className='space-y-3'>
            <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                Total Posts
              </div>
              <div className='text-2xl font-bold text-slate-900 dark:text-white mt-1'>
                247
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                +23 this week
              </div>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                Published
              </div>
              <div className='text-2xl font-bold text-green-600 dark:text-green-400 mt-1'>
                189
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                76% of total
              </div>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                Scheduled
              </div>
              <div className='text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1'>
                42
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                Next 7 days
              </div>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                Drafts
              </div>
              <div className='text-2xl font-bold text-slate-600 dark:text-slate-400 mt-1'>
                16
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                Ready to publish
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
            <h3 className='font-semibold text-slate-900 dark:text-white mb-3'>
              Quick Filters
            </h3>
            <div className='space-y-2'>
              {[
                { name: 'All Posts', count: 247 },
                { name: 'Published', count: 189 },
                { name: 'Scheduled', count: 42 },
                { name: 'Drafts', count: 16 },
              ].map((filter) => (
                <button
                  key={filter.name}
                  className='w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors group'
                >
                  <span>{filter.name}</span>
                  <span className='text-xs text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Platform Filters */}
          <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
            <h3 className='font-semibold text-slate-900 dark:text-white mb-3'>
              Platforms
            </h3>
            <div className='space-y-2'>
              {[
                { name: 'Twitter', count: 89 },
                { name: 'Instagram', count: 76 },
                { name: 'Facebook', count: 54 },
                { name: 'LinkedIn', count: 28 },
              ].map((platform) => (
                <label
                  key={platform.name}
                  className='flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer'
                >
                  <div className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='rounded border-slate-300 text-indigo-600 focus:ring-indigo-500'
                    />
                    <span className='text-slate-700 dark:text-slate-300'>
                      {platform.name}
                    </span>
                  </div>
                  <span className='text-xs text-slate-500 dark:text-slate-400'>
                    {platform.count}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Posts Table */}
        <div className='lg:col-span-2 space-y-4'>
          {/* Search Bar */}
          <div className='flex items-center gap-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
              <input
                type='text'
                placeholder='Search posts...'
                className='w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
              />
            </div>
            <button className='flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap'>
              <Filter className='h-4 w-4' />
              Filter
            </button>
          </div>

          {/* Posts Table */}
          <PostsTable />

          {/* Pagination */}
          <div className='flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              Showing{' '}
              <span className='font-medium text-slate-900 dark:text-white'>
                1-6
              </span>{' '}
              of{' '}
              <span className='font-medium text-slate-900 dark:text-white'>
                247
              </span>{' '}
              posts
            </p>
            <div className='flex items-center gap-2'>
              <button className='p-2 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                <ChevronLeft className='h-4 w-4 text-slate-600 dark:text-slate-400' />
              </button>
              <button className='px-3 py-1 rounded-lg bg-indigo-600 text-white font-medium text-sm'>
                1
              </button>
              <button className='px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors'>
                2
              </button>
              <button className='px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors'>
                3
              </button>
              <span className='px-2 text-slate-500 dark:text-slate-400'>
                ...
              </span>
              <button className='px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors'>
                42
              </button>
              <button className='p-2 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors'>
                <ChevronRight className='h-4 w-4 text-slate-600 dark:text-slate-400' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
