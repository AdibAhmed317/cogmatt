import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Eye,
  MoreVertical,
} from 'lucide-react';

const posts = [
  {
    id: 1,
    content: 'Launching our new AI feature! 🚀',
    platforms: [
      { name: 'Facebook', icon: Facebook, color: 'text-blue-500' },
      { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
      { name: 'Twitter', icon: Twitter, color: 'text-sky-500' },
    ],
    status: 'published',
    date: 'Oct 15, 2:30 PM',
    engagement: '2.4K',
  },
  {
    id: 2,
    content: "Don't miss our live Q&A tomorrow!",
    platforms: [
      { name: 'Linkedin', icon: Linkedin, color: 'text-blue-700' },
      { name: 'Youtube', icon: Youtube, color: 'text-red-500' },
    ],
    status: 'scheduled',
    date: 'Oct 20, 10:00 AM',
    engagement: '--',
  },
  {
    id: 3,
    content: 'Motivation Monday: Keep creating! 💪',
    platforms: [
      { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
      { name: 'Twitter', icon: Twitter, color: 'text-sky-500' },
    ],
    status: 'draft',
    date: 'Not scheduled',
    engagement: '--',
  },
  {
    id: 4,
    content: 'Behind the scenes: How we build features',
    platforms: [
      { name: 'Twitter', icon: Twitter, color: 'text-sky-500' },
      { name: 'Linkedin', icon: Linkedin, color: 'text-blue-700' },
    ],
    status: 'published',
    date: 'Oct 14, 3:15 PM',
    engagement: '1.8K',
  },
  {
    id: 5,
    content: 'Product update: New dashboard features',
    platforms: [{ name: 'Facebook', icon: Facebook, color: 'text-blue-500' }],
    status: 'published',
    date: 'Oct 13, 9:00 AM',
    engagement: '1.2K',
  },
  {
    id: 6,
    content: 'Weekly recap: Top moments this week',
    platforms: [{ name: 'Instagram', icon: Instagram, color: 'text-pink-500' }],
    status: 'scheduled',
    date: 'Oct 22, 5:00 PM',
    engagement: '--',
  },
];

export default function PostsTable() {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'draft':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div>
      <div className='overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-left'>
            <thead className='bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700'>
              <tr>
                <th className='px-6 py-3 text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider'>
                  Content
                </th>
                <th className='px-6 py-3 text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider'>
                  Platforms
                </th>
                <th className='px-6 py-3 text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-3 text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider'>
                  Engagement
                </th>
                <th className='px-6 py-3 text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
                >
                  <td className='px-6 py-4'>
                    <p className='text-sm text-slate-900 dark:text-white font-medium max-w-xs truncate'>
                      {post.content}
                    </p>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-2'>
                      {post.platforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                          <div key={platform.name} title={platform.name}>
                            <Icon className={`h-5 w-5 ${platform.color}`} />
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(post.status)}`}
                    >
                      {post.status.charAt(0).toUpperCase() +
                        post.status.slice(1)}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      {post.date}
                    </p>
                  </td>
                  <td className='px-6 py-4'>
                    <p className='text-sm font-medium text-slate-900 dark:text-white'>
                      {post.engagement}
                    </p>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <button
                        className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                        title='View'
                      >
                        <Eye className='h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300' />
                      </button>
                      <button
                        className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                        title='Edit'
                      >
                        <Edit className='h-4 w-4 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400' />
                      </button>
                      {post.status !== 'published' && (
                        <button
                          className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                          title='Schedule'
                        >
                          <CalendarIcon className='h-4 w-4 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400' />
                        </button>
                      )}
                      <button
                        className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                        title='Delete'
                      >
                        <Trash2 className='h-4 w-4 text-slate-400 hover:text-red-600 dark:hover:text-red-400' />
                      </button>
                      <button
                        className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                        title='More'
                      >
                        <MoreVertical className='h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
