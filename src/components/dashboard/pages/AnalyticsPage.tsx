import {
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  BarChart2,
  Download,
} from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-white'>
            Analytics
          </h1>
          <p className='text-slate-600 dark:text-slate-400 mt-1'>
            Track your performance and engagement metrics
          </p>
        </div>
        <button className='flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap'>
          <Download className='h-5 w-5' />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className='grid gap-4 grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm text-slate-600 dark:text-slate-400'>
              Total Reach
            </div>
            <TrendingUp className='h-5 w-5 text-green-500' />
          </div>
          <div className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-white'>
            247.5K
          </div>
          <div className='text-sm text-green-600 dark:text-green-400 mt-1'>
            +12.5% from last month
          </div>
        </div>
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm text-slate-600 dark:text-slate-400'>
              Engagement
            </div>
            <Heart className='h-5 w-5 text-pink-500' />
          </div>
          <div className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-white'>
            18.2K
          </div>
          <div className='text-sm text-green-600 dark:text-green-400 mt-1'>
            +8.3% from last month
          </div>
        </div>
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm text-slate-600 dark:text-slate-400'>
              Comments
            </div>
            <MessageCircle className='h-5 w-5 text-blue-500' />
          </div>
          <div className='text-3xl font-bold text-slate-900 dark:text-white'>
            3.4K
          </div>
          <div className='text-sm text-green-600 dark:text-green-400 mt-1'>
            +15.7% from last month
          </div>
        </div>
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm text-slate-600 dark:text-slate-400'>
              Followers
            </div>
            <Users className='h-5 w-5 text-indigo-500' />
          </div>
          <div className='text-3xl font-bold text-slate-900 dark:text-white'>
            45.2K
          </div>
          <div className='text-sm text-green-600 dark:text-green-400 mt-1'>
            +3.2% from last month
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className='rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2'>
            <BarChart2 className='h-6 w-6 text-indigo-500' />
            Engagement Overview
          </h2>
          <select className='rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
        </div>
        <div className='h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg'>
          <div className='text-center'>
            <BarChart2 className='h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-2' />
            <p className='text-slate-500 dark:text-slate-400'>
              Chart visualization would go here
            </p>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
        <div className='rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-white mb-4'>
            Top Performing Posts
          </h2>
          <div className='space-y-3'>
            {[
              {
                title: 'Launching our new AI feature! 🚀',
                engagement: '2.4K',
                platform: 'Twitter',
              },
              {
                title: 'Behind the scenes at Cogmatt',
                engagement: '1.8K',
                platform: 'Instagram',
              },
              {
                title: "Product update: What's new",
                engagement: '1.5K',
                platform: 'LinkedIn',
              },
            ].map((post, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50'
              >
                <div className='flex-1'>
                  <p className='font-medium text-slate-900 dark:text-white'>
                    {post.title}
                  </p>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    {post.platform}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='font-bold text-indigo-600 dark:text-indigo-400'>
                    {post.engagement}
                  </p>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>
                    engagements
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-white mb-4'>
            Platform Performance
          </h2>
          <div className='space-y-4'>
            {[
              {
                name: 'Twitter',
                reach: '89K',
                color: 'bg-sky-500',
                width: '90%',
              },
              {
                name: 'Instagram',
                reach: '72K',
                color: 'bg-pink-500',
                width: '75%',
              },
              {
                name: 'LinkedIn',
                reach: '54K',
                color: 'bg-blue-700',
                width: '60%',
              },
              {
                name: 'Facebook',
                reach: '32K',
                color: 'bg-blue-500',
                width: '40%',
              },
            ].map((platform, idx) => (
              <div key={idx}>
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-medium text-slate-900 dark:text-white'>
                    {platform.name}
                  </span>
                  <span className='text-sm text-slate-600 dark:text-slate-400'>
                    {platform.reach}
                  </span>
                </div>
                <div className='h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
                  <div
                    className={`h-full ${platform.color}`}
                    style={{ width: platform.width }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
