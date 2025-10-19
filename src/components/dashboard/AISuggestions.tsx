export default function AISuggestions() {
  const suggestions = [
    'Try a motivational post for Monday!',
    'Share a behind-the-scenes story.',
    'Announce your next live event.',
    'Ask your audience a question.',
    'Share a trending hashtag.',
    'Post a quick tip for creators.',
  ];
  return (
    <div className='mb-8'>
      <h2 className='mb-4 text-xl font-bold text-slate-900 dark:text-white'>
        AI Suggestions
      </h2>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'
          >
            <span className='text-slate-700 dark:text-slate-300'>
              {suggestion}
            </span>
          </div>
        ))}
      </div>
      <button className='mt-4 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl'>
        Generate new post
      </button>
    </div>
  );
}
