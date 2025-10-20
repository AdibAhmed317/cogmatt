import { createFileRoute } from '@tanstack/react-router';

// Define the User type
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserStats {
  totalUsers: number;
  sample: Array<{ id: number; name: string }>;
}

// Server-side loader - runs on the server
export const Route = createFileRoute('/user')({
  loader: async () => {
    // Fetch from your API
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    const [usersRes, statsRes] = await Promise.all([
      fetch(`${baseUrl}/api/user?limit=5`),
      fetch(`${baseUrl}/api/user/stats`),
    ]);

    if (!usersRes.ok || !statsRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const users = (await usersRes.json()) as User[];
    const stats = (await statsRes.json()) as UserStats;

    return {
      users,
      stats,
      timestamp: new Date().toISOString(),
    };
  },
  component: UserPage,
  pendingComponent: LoadingFallback,
  errorComponent: ErrorFallback,
});

// Loading fallback component
function LoadingFallback() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='animate-pulse space-y-8'>
          <div className='h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3'></div>
          <div className='h-64 bg-gray-300 dark:bg-gray-700 rounded'></div>
          <div className='h-96 bg-gray-300 dark:bg-gray-700 rounded'></div>
        </div>
      </div>
    </div>
  );
}

// Error fallback component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-l-4 border-red-500'>
          <h1 className='text-3xl font-bold text-red-600 dark:text-red-400 mb-4'>
            Error Loading Data
          </h1>
          <p className='text-gray-700 dark:text-gray-300 mb-4'>
            {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

// Main page component
function UserPage() {
  const { users, stats, timestamp } = Route.useLoaderData();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8'>
      <div className='max-w-6xl mx-auto space-y-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            User API Dashboard
          </h1>
          <p className='text-gray-600 dark:text-gray-400 text-lg'>
            Server-Side Rendered with TanStack Start
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-500 mt-2'>
            Loaded at: {new Date(timestamp).toLocaleString()}
          </p>
        </div>

        {/* Stats Card */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3'>
            <span className='text-3xl'>📊</span>
            Statistics
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white'>
              <p className='text-sm font-medium opacity-90'>Total Users</p>
              <p className='text-4xl font-bold mt-2'>{stats.totalUsers}</p>
            </div>
            <div className='bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white'>
              <p className='text-sm font-medium opacity-90'>Sample Size</p>
              <p className='text-4xl font-bold mt-2'>{stats.sample.length}</p>
            </div>
          </div>

          <div className='mt-6'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
              Sample Users
            </h3>
            <div className='space-y-2'>
              {stats.sample.map((user: { id: number; name: string }) => (
                <div
                  key={user.id}
                  className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'
                >
                  <span className='text-2xl'>👤</span>
                  <div>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {user.name}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      ID: {user.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700'>
          <div className='p-8 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3'>
              <span className='text-3xl'>👥</span>
              All Users (Limit: 5)
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Fetched from:{' '}
              <code className='bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
                GET /api/user?limit=5
              </code>
            </p>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider'>
                    ID
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {users.map((user: User, idx: number) => (
                  <tr
                    key={user.id}
                    className={
                      idx % 2 === 0
                        ? 'bg-white dark:bg-gray-800'
                        : 'bg-gray-50 dark:bg-gray-750'
                    }
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold text-sm'>
                        {user.id}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center gap-3'>
                        <span className='text-2xl'>👤</span>
                        <span className='font-medium text-gray-900 dark:text-white'>
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <a
                        href={`mailto:${user.email}`}
                        className='text-blue-600 dark:text-blue-400 hover:underline'
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <button
                        onClick={() => {
                          window.open(`/api/user/user/${user.id}`, '_blank');
                        }}
                        className='px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors'
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Endpoints Reference */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3'>
            <span className='text-3xl'>🔗</span>
            Available API Endpoints
          </h2>
          <div className='space-y-3'>
            {[
              { method: 'GET', path: '/api/user', desc: 'List all users' },
              {
                method: 'GET',
                path: '/api/user?limit=5',
                desc: 'List users with limit',
              },
              {
                method: 'GET',
                path: '/api/user/stats',
                desc: 'Get user statistics',
              },
              {
                method: 'GET',
                path: '/api/user/users-v2',
                desc: 'List users (v2 format)',
              },
              {
                method: 'GET',
                path: '/api/user/user/:id',
                desc: 'Get single user by ID',
              },
            ].map((endpoint, idx) => (
              <div
                key={idx}
                className='flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
              >
                <span className='px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold rounded'>
                  {endpoint.method}
                </span>
                <div className='flex-1'>
                  <code className='text-sm font-mono text-gray-900 dark:text-white'>
                    {endpoint.path}
                  </code>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                    {endpoint.desc}
                  </p>
                </div>
                <a
                  href={endpoint.path}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors'
                >
                  Test
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className='text-center'>
          <a
            href='/'
            className='inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium'
          >
            <span>←</span>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
