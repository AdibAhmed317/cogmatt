import { Plus, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PostsTable from '../PostsTable';
import PostComposer from '../PostComposer';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useState, useEffect } from 'react';

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

interface Stats {
  total: number;
  published: number;
  scheduled: number;
  drafts: number;
}

export default function PostsPage() {
  const { user } = useAuth();
  const [agencyId, setAgencyId] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    published: 0,
    scheduled: 0,
    drafts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const limit = 10;

  // Fetch agency ID
  useEffect(() => {
    const fetchAgency = async () => {
      if (!user?.userId) return;
      try {
        const res = await fetch(`/api/agency/me?ownerId=${user.userId}`);
        if (res.ok) {
          const data = await res.json();
          setAgencyId(data.agencyId);
        }
      } catch (error) {
        console.error('Error loading agency:', error);
      }
    };
    fetchAgency();
  }, [user?.userId]);

  // Fetch posts from Facebook
  useEffect(() => {
    const fetchPosts = async () => {
      if (!agencyId) return;
      setLoading(true);
      try {
        // Fetch posts from Facebook via our API
        const res = await fetch(`/api/facebook/posts/${agencyId}`);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('[PostsPage] API error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch posts');
        }

        const data = await res.json();
        console.log('[PostsPage] API response:', data);
        console.log('[PostsPage] data.posts:', data.posts);
        console.log('[PostsPage] data.posts array length:', data.posts?.length);
        console.log('[PostsPage] data.success:', data.success);

        // Log each individual post
        if (Array.isArray(data.posts)) {
          data.posts.forEach((post: any, index: number) => {
            console.log(`[PostsPage] Post ${index + 1}:`, {
              id: post.id,
              content: post.content?.substring(0, 50),
              engagement: post.engagement,
              status: post.status,
            });
          });
        }

        const facebookPosts = Array.isArray(data.posts) ? data.posts : [];
        console.log(
          '[PostsPage] Facebook posts after array check:',
          facebookPosts.length
        ); // Apply filters
        let filteredPosts = facebookPosts;

        // Filter by status
        if (statusFilter !== 'all') {
          filteredPosts = filteredPosts.filter(
            (post: Post) => post.status === statusFilter
          );
        }

        // Filter by search term
        if (searchTerm) {
          filteredPosts = filteredPosts.filter((post: Post) =>
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Calculate stats
        const total = facebookPosts.length;
        const published = facebookPosts.filter(
          (p: Post) => p.status === 'published'
        ).length;
        const scheduled = facebookPosts.filter(
          (p: Post) => p.status === 'scheduled'
        ).length;

        setStats({
          total,
          published,
          scheduled,
          drafts: 0, // No drafts since we're fetching from Facebook
        });

        // Pagination
        const start = (currentPage - 1) * limit;
        const end = start + limit;
        const paginatedPosts = filteredPosts.slice(start, end);

        setPosts(paginatedPosts);
        setTotalPages(Math.ceil(filteredPosts.length / limit) || 1);
        setTotalPosts(filteredPosts.length);
      } catch (error) {
        console.error('[PostsPage] Error loading posts:', error);
        setPosts([]);
        setStats({ total: 0, published: 0, scheduled: 0, drafts: 0 });
        setTotalPages(1);
        setTotalPosts(0);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [agencyId, currentPage, statusFilter, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, totalPosts);

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
                {stats.total}
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                All posts
              </div>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                Published
              </div>
              <div className='text-2xl font-bold text-green-600 dark:text-green-400 mt-1'>
                {stats.published}
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                {stats.total > 0
                  ? Math.round((stats.published / stats.total) * 100)
                  : 0}
                % of total
              </div>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                Scheduled
              </div>
              <div className='text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1'>
                {stats.scheduled}
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                Upcoming posts
              </div>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                Drafts
              </div>
              <div className='text-2xl font-bold text-slate-600 dark:text-slate-400 mt-1'>
                {stats.drafts}
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
                { name: 'All Posts', count: stats.total, value: 'all' },
                { name: 'Published', count: stats.published, value: 'posted' },
                { name: 'Scheduled', count: stats.scheduled, value: 'pending' },
                { name: 'Drafts', count: stats.drafts, value: 'draft' },
              ].map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => handleFilterChange(filter.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                    statusFilter === filter.value
                      ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800'
                  }`}
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

        {/* Right Column - Composer & Posts Table */}
        <div className='lg:col-span-2 space-y-4'>
          {/* Composer */}
          <PostComposer />
          {/* Search Bar */}
          <div className='flex items-center gap-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
              <input
                type='text'
                placeholder='Search posts...'
                value={searchTerm}
                onChange={handleSearch}
                className='w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
              />
            </div>
            <button className='flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap'>
              <Filter className='h-4 w-4' />
              Filter
            </button>
          </div>

          {/* Posts Table */}
          {loading ? (
            <div className='rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 text-center'>
              <div className='text-slate-600 dark:text-slate-400'>
                Loading posts...
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className='rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 text-center'>
              <div className='text-slate-600 dark:text-slate-400'>
                {searchTerm || statusFilter !== 'all'
                  ? 'No posts found matching your filters'
                  : 'No posts yet. Create your first post above!'}
              </div>
            </div>
          ) : (
            <PostsTable posts={posts} />
          )}

          {/* Pagination */}
          <div className='flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              Showing{' '}
              <span className='font-medium text-slate-900 dark:text-white'>
                {startIndex}-{endIndex}
              </span>{' '}
              of{' '}
              <span className='font-medium text-slate-900 dark:text-white'>
                {totalPosts}
              </span>{' '}
              posts
            </p>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='p-2 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                <ChevronLeft className='h-4 w-4 text-slate-600 dark:text-slate-400' />
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg font-medium text-sm transition-colors ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className='px-2 text-slate-500 dark:text-slate-400'>
                    ...
                  </span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className='px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors'
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='p-2 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                <ChevronRight className='h-4 w-4 text-slate-600 dark:text-slate-400' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
