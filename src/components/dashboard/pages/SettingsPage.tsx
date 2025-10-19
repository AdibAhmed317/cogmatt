import { User, Bell, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-white'>
          Settings
        </h1>
        <p className='text-slate-600 dark:text-slate-400 mt-1'>
          Manage your account and preferences
        </p>
      </div>

      {/* Settings Sections - Two Column Layout */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Profile Settings */}
        <div className='rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center gap-3 mb-4'>
            <User className='h-6 w-6 text-indigo-500' />
            <h2 className='text-xl font-bold text-slate-900 dark:text-white'>
              Profile
            </h2>
          </div>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                Full Name
              </label>
              <input
                type='text'
                defaultValue='Alex Johnson'
                className='w-full rounded-lg border border-slate-200 bg-white py-2 px-4 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                Email
              </label>
              <input
                type='email'
                defaultValue='alex@cogmatt.com'
                className='w-full rounded-lg border border-slate-200 bg-white py-2 px-4 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                Bio
              </label>
              <textarea
                defaultValue='Social media manager passionate about creating engaging content'
                className='w-full rounded-lg border border-slate-200 bg-white py-2 px-4 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white min-h-24'
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className='rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center gap-3 mb-4'>
            <Bell className='h-6 w-6 text-indigo-500' />
            <h2 className='text-xl font-bold text-slate-900 dark:text-white'>
              Notifications
            </h2>
          </div>
          <div className='space-y-4'>
            {[
              {
                label: 'Email notifications',
                description: 'Receive email updates about your posts',
              },
              {
                label: 'Push notifications',
                description: 'Get push notifications on your device',
              },
              {
                label: 'Post reminders',
                description: 'Remind me about scheduled posts',
              },
              {
                label: 'Weekly reports',
                description: 'Receive weekly performance reports',
              },
            ].map((item, idx) => (
              <div key={idx} className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-slate-900 dark:text-white'>
                    {item.label}
                  </p>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    {item.description}
                  </p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    type='checkbox'
                    className='sr-only peer'
                    defaultChecked={idx < 2}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Accounts */}
        <div className='rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center gap-3 mb-4'>
            <Globe className='h-6 w-6 text-indigo-500' />
            <h2 className='text-xl font-bold text-slate-900 dark:text-white'>
              Connected Accounts
            </h2>
          </div>
          <div className='space-y-3'>
            {[
              { name: 'Twitter', connected: true, username: '@alexjohnson' },
              { name: 'Instagram', connected: true, username: '@alex.creates' },
              { name: 'LinkedIn', connected: true, username: 'Alex Johnson' },
              { name: 'Facebook', connected: false, username: null },
              { name: 'TikTok', connected: false, username: null },
            ].map((account, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50'
              >
                <div>
                  <p className='font-medium text-slate-900 dark:text-white'>
                    {account.name}
                  </p>
                  {account.connected && (
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      {account.username}
                    </p>
                  )}
                </div>
                <button
                  className={`rounded-lg px-4 py-2 font-medium ${
                    account.connected
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {account.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className='rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center gap-3 mb-4'>
            <Shield className='h-6 w-6 text-indigo-500' />
            <h2 className='text-xl font-bold text-slate-900 dark:text-white'>
              Security
            </h2>
          </div>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                Change Password
              </label>
              <button className='rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'>
                Update Password
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium text-slate-900 dark:text-white'>
                  Two-factor authentication
                </p>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  Add an extra layer of security
                </p>
              </div>
              <button className='rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700'>
                Enable
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex items-center justify-end gap-3'>
          <button className='rounded-lg border border-slate-200 bg-white px-6 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'>
            Cancel
          </button>
          <button className='rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-2 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl'>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
