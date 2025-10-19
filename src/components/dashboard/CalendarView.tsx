export default function CalendarView() {
  return (
    <div className='mb-8'>
      <h2 className='mb-4 text-xl font-bold text-slate-900 dark:text-white'>
        Content Calendar
      </h2>
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
          {[...Array(14)].map((_, idx) => (
            <div
              key={idx}
              className='h-16 rounded-lg bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 flex items-center justify-center text-xs text-slate-700 dark:text-slate-300'
            >
              {idx % 3 === 0 ? 'Scheduled' : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
