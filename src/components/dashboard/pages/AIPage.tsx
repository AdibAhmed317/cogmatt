import { Sparkles, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import AISuggestions from '../AISuggestions';

export default function AIPage() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-white'>
            AI Assistant
          </h1>
          <p className='text-slate-600 dark:text-slate-400 mt-1'>
            Get AI-powered content suggestions and ideas
          </p>
        </div>
        <button className='flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl whitespace-nowrap'>
          <RefreshCw className='h-5 w-5' />
          Generate New
        </button>
      </div>

      {/* AI Stats */}
      <div className='grid gap-4 grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
          <div className='text-sm text-slate-600 dark:text-slate-400'>
            Generated Today
          </div>
          <div className='text-2xl font-bold text-slate-900 dark:text-white mt-1'>
            24
          </div>
        </div>
        <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
          <div className='text-sm text-slate-600 dark:text-slate-400'>Used</div>
          <div className='text-2xl font-bold text-green-600 dark:text-green-400 mt-1'>
            18
          </div>
        </div>
        <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
          <div className='text-sm text-slate-600 dark:text-slate-400'>
            Saved
          </div>
          <div className='text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1'>
            12
          </div>
        </div>
        <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
          <div className='text-sm text-slate-600 dark:text-slate-400'>
            Success Rate
          </div>
          <div className='text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1'>
            85%
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Left - AI Prompt */}
        <div className='rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2'>
            <Sparkles className='h-6 w-6 text-indigo-500' />
            Generate Content
          </h2>
          <textarea
            placeholder='Describe what kind of content you want to generate... (e.g., "Create a motivational post about productivity")'
            className='w-full rounded-lg border border-slate-200 bg-white p-4 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white min-h-32'
          />
          <div className='flex flex-col gap-3 mt-4'>
            <button className='rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-2 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl'>
              Generate
            </button>
            <select className='rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'>
              <option>All Platforms</option>
              <option>Twitter</option>
              <option>Facebook</option>
              <option>Instagram</option>
              <option>LinkedIn</option>
            </select>
            <select className='rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'>
              <option>Professional</option>
              <option>Casual</option>
              <option>Humorous</option>
              <option>Inspirational</option>
            </select>
          </div>
        </div>

        {/* Right - Recent Generations */}
        <div className='rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-white mb-4'>
            Recent Generations
          </h2>
          <div className='space-y-3'>
            {[
              {
                text: 'Ready to level up your productivity? Here are 5 game-changing tips...',
                status: 'used',
              },
              {
                text: 'Behind the scenes: How we build amazing products 🚀',
                status: 'saved',
              },
              {
                text: 'Monday motivation: Your only limit is you! 💪',
                status: 'dismissed',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50'
              >
                <div className='flex-1'>
                  <p className='text-slate-700 dark:text-slate-300 text-sm'>
                    {item.text}
                  </p>
                  <span
                    className={`text-xs mt-1 inline-block ${
                      item.status === 'used'
                        ? 'text-green-600 dark:text-green-400'
                        : item.status === 'saved'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
                <div className='flex items-center gap-2 ml-2'>
                  <button className='p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700'>
                    <ThumbsUp className='h-4 w-4 text-slate-400' />
                  </button>
                  <button className='p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700'>
                    <ThumbsDown className='h-4 w-4 text-slate-400' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <AISuggestions />
    </div>
  );
}
