export default function CalendarView() {
  // Simple heuristic: highlight best posting windows (Tue-Thu, 10am-2pm)
  // For this static grid, we'll mark some cells as "Best time" for demo.
  const isBest = (idx: number) => [2, 3, 4, 9, 10].includes(idx);

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold text-slate-900 dark:text-white'>
          Content Calendar
        </h2>
        <div className='flex items-center gap-3 text-xs'>
          <span className='inline-flex items-center gap-1 text-slate-600 dark:text-slate-400'>
            <span className='h-3 w-3 rounded bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 border border-slate-200 dark:border-slate-800' />
            Scheduled
          </span>
          <span className='inline-flex items-center gap-1 text-slate-600 dark:text-slate-400'>
            <span className='h-3 w-3 rounded bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-900' />
            Best time
          </span>
        </div>
      </div>
      <div className='rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
        <div className='grid grid-cols-7 gap-2'>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div
              key={day}
              className='text-center font-semibold text-slate-700 dark:text-slate-300'
            >
              {day}
            </div>
          ))}
          {[...Array(14)].map((_, idx) => {
            const scheduled = idx % 3 === 0;
            const best = isBest(idx);
            return (
              <div
                key={idx}
                className={`h-16 rounded-lg flex items-center justify-center text-xs transition-colors ${
                  scheduled
                    ? 'bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 text-slate-700 dark:text-slate-300'
                    : best
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                }`}
                title={
                  best
                    ? 'Recommended posting window'
                    : scheduled
                      ? 'Scheduled'
                      : ''
                }
              >
                {scheduled ? 'Scheduled' : best ? 'Best time' : ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
