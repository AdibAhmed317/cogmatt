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
  Heart,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Post {
  id: string;
  content: string;
  status: string;
  scheduledAt: Date | null;
  createdAt: Date;
  platforms: Array<{ id: string; name: string }>;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

interface PostsTableProps {
  posts: Post[];
}

const platformIcons: Record<string, { icon: any; color: string }> = {
  Facebook: { icon: Facebook, color: 'text-blue-500' },
  Instagram: { icon: Instagram, color: 'text-pink-500' },
  Twitter: { icon: Twitter, color: 'text-sky-500' },
  LinkedIn: { icon: Linkedin, color: 'text-blue-700' },
  Youtube: { icon: Youtube, color: 'text-red-500' },
};

export default function PostsTable({ posts }: PostsTableProps) {
  // Safety check - ensure posts is an array
  const safePosts = Array.isArray(posts) ? posts : [];
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openMenuId]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'published':
      case 'posted':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'scheduled':
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'scheduled':
        return 'Scheduled';
      case 'posted':
        return 'Published';
      case 'pending':
        return 'Scheduled';
      case 'failed':
        return 'Failed';
      default:
        return 'Draft';
    }
  };

  const formatDate = (date: Date | null, scheduledAt: Date | null) => {
    if (!date) return 'Unknown';
    if (scheduledAt) {
      return new Date(scheduledAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    }
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
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
                  Platform
                </th>
                <th className='px-6 py-3 text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-3 text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-right'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
              {safePosts.map((post) => (
                <tr
                  key={post.id}
                  className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
                >
                  <td className='px-6 py-4 max-w-md'>
                    <div className='space-y-1'>
                      <p className='text-sm text-slate-900 dark:text-white font-medium line-clamp-2'>
                        {post.content}
                      </p>
                      {post.engagement && (
                        <div className='flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400'>
                          <span className='flex items-center gap-1'>
                            <Heart className='h-3.5 w-3.5' />
                            {post.engagement.likes}
                          </span>
                          <span className='flex items-center gap-1'>
                            <MessageCircle className='h-3.5 w-3.5' />
                            {post.engagement.comments}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Share2 className='h-3.5 w-3.5' />
                            {post.engagement.shares}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-2'>
                      {post.platforms.map((platform) => {
                        const platformInfo = platformIcons[platform.name];
                        if (!platformInfo) return null;
                        const Icon = platformInfo.icon;
                        return (
                          <div key={platform.id} title={platform.name}>
                            <Icon className={`h-5 w-5 ${platformInfo.color}`} />
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(post.status)}`}
                    >
                      {getStatusLabel(post.status)}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <p className='text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap'>
                      {formatDate(post.createdAt, post.scheduledAt)}
                    </p>
                  </td>
                  <td className='px-6 py-4'>
                    <div
                      className='flex items-center justify-end gap-1 relative'
                      ref={menuRef}
                    >
                      <button
                        className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                        title='View'
                        onClick={() => console.log('View post:', post.id)}
                      >
                        <Eye className='h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300' />
                      </button>
                      <button
                        className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                        title='Edit'
                        onClick={() => console.log('Edit post:', post.id)}
                      >
                        <Edit className='h-4 w-4 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400' />
                      </button>
                      <button
                        className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                        title='More actions'
                        onClick={() =>
                          setOpenMenuId(openMenuId === post.id ? null : post.id)
                        }
                      >
                        <MoreVertical className='h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300' />
                      </button>

                      {openMenuId === post.id && (
                        <div className='absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50'>
                          <div className='py-1'>
                            {post.status !== 'published' && (
                              <button
                                className='w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2'
                                onClick={() => {
                                  console.log('Schedule post:', post.id);
                                  setOpenMenuId(null);
                                }}
                              >
                                <CalendarIcon className='h-4 w-4' />
                                Schedule
                              </button>
                            )}
                            <button
                              className='w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2'
                              onClick={() => {
                                console.log('Delete post:', post.id);
                                setOpenMenuId(null);
                              }}
                            >
                              <Trash2 className='h-4 w-4' />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
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
