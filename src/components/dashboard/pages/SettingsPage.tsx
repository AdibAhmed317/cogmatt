import { User, Bell, Shield, Globe, Lock, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/presentation/contexts/AuthContext';

interface SocialAccount {
  id: string;
  platformName: string;
  username: string;
  profilePicture?: string;
  profileUrl?: string;
  isExpired: boolean;
  createdAt: string;
  accountId?: string;
}

export default function SettingsPage() {
  const { checkAuth, user } = useAuth();

  // Profile state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);
  const [updateErr, setUpdateErr] = useState<string | null>(null);

  // Social accounts state
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [agencyId, setAgencyId] = useState<string>('');

  // Initialize profile fields from user context
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      // Bio is not in User entity yet, keep empty for now
    }
  }, [user]);

  // Load connected accounts
  // Resolve agency first, then load accounts
  useEffect(() => {
    const init = async () => {
      if (!user?.userId) return; // wait for auth
      if (!agencyId) {
        try {
          const res = await fetch(`/api/agency/me?ownerId=${user.userId}`);
          if (res.ok) {
            const data = await res.json();
            setAgencyId(data.agencyId);
          }
        } catch (e) {
          console.error('Failed to resolve agency', e);
        }
      }
    };
    init();
  }, [user?.userId, agencyId]);

  useEffect(() => {
    if (agencyId) {
      loadAccounts();
    }
  }, [agencyId]);

  const loadAccounts = async () => {
    if (!agencyId) return;
    try {
      setLoadingAccounts(true);
      const response = await fetch(`/api/social-accounts/${agencyId}`);
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleConnectFacebook = async () => {
    try {
      setConnecting(true);

      // Get auth URL
      if (!agencyId) {
        alert('Agency not ready yet');
        return;
      }
      const response = await fetch(
        `/api/social-accounts/facebook/auth?agencyId=${agencyId}`
      );
      const data = await response.json();

      if (!data.authUrl) {
        throw new Error('Failed to get auth URL');
      }

      // Open popup
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        data.authUrl,
        'Facebook Login',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for callback
      const handleMessage = async (event: MessageEvent) => {
        if (event.data.type === 'FACEBOOK_AUTH_SUCCESS') {
          // Backend already saved the user and pages. Reload accounts to reflect new entries.
          setAgencyId(event.data.agencyId);
          popup?.close();
          await loadAccounts();
          setConnecting(false);
        } else if (event.data.type === 'FACEBOOK_AUTH_ERROR') {
          console.error('Facebook auth error:', event.data.error);
          alert(`Authentication failed: ${event.data.error}`);
          setConnecting(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setConnecting(false);
        }
      }, 500);
    } catch (error) {
      console.error('Error connecting Facebook:', error);
      alert('Failed to connect Facebook account');
      setConnecting(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Are you sure you want to disconnect this account?')) {
      return;
    }

    try {
      const response = await fetch(`/api/social-accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadAccounts();
      } else {
        throw new Error('Failed to disconnect account');
      }
    } catch (error) {
      console.error('Error disconnecting account:', error);
      alert('Failed to disconnect account');
    }
  };

  const handleUpdatePassword = async () => {
    setUpdateMsg(null);
    setUpdateErr(null);
    if (!newPassword || newPassword.length < 8) {
      setUpdateErr('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setUpdateErr('New password and confirm password do not match');
      return;
    }
    setIsUpdating(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPassword || undefined,
          newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.message || 'Failed to update password');
      setUpdateMsg('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // refresh auth state in case anything depends on it
      await checkAuth();
    } catch (e: any) {
      setUpdateErr(e.message || 'Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProfile = async () => {
    setProfileMsg(null);
    setProfileErr(null);

    if (!profileName.trim() && !profileEmail.trim()) {
      setProfileErr('Please provide at least name or email');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName.trim() || undefined,
          email: profileEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to update profile');
      }

      setProfileMsg(data.message || 'Profile updated successfully');
      // Refresh auth state to get updated user info
      await checkAuth();
    } catch (e: any) {
      setProfileErr(e.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

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
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className='w-full rounded-lg border border-slate-200 bg-white py-2 px-4 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                Email
              </label>
              <input
                type='email'
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className='w-full rounded-lg border border-slate-200 bg-white py-2 px-4 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                Bio
              </label>
              <textarea
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                className='w-full rounded-lg border border-slate-200 bg-white py-2 px-4 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white min-h-24'
              />
            </div>

            {/* Update Profile Button */}
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className='w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </button>

            {/* Success/Error Messages */}
            {profileMsg && (
              <div className='text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg'>
                {profileMsg}
              </div>
            )}
            {profileErr && (
              <div className='text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg'>
                {profileErr}
              </div>
            )}
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

          {/* Page selection is no longer handled on the client; Facebook provides the choice during OAuth.
              We only reload accounts after successful auth so saved Pages appear in the list. */}

          {/* Accounts List */}
          <div className='space-y-3'>
            {/* Always show Facebook section */}
            <div className='mb-4'>
              <p className='font-bold text-lg text-slate-900 dark:text-white mb-2'>
                Facebook
              </p>
              {loadingAccounts ? (
                <div className='flex items-center justify-center py-8'>
                  <Loader2 className='h-6 w-6 animate-spin text-indigo-600' />
                </div>
              ) : (
                <>
                  {/* Show Facebook Connect button if no Facebook user or page is present */}
                  {accounts.filter((acc) => acc.platformName === 'Facebook')
                    .length === 0 && (
                    <div className='flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50'>
                      <div>
                        <p className='font-medium text-slate-900 dark:text-white'>
                          Connect your Facebook account to manage Pages and
                          post.
                        </p>
                      </div>
                      <button
                        onClick={handleConnectFacebook}
                        disabled={connecting}
                        className='rounded-lg px-4 py-2 font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2'
                      >
                        {connecting ? (
                          <>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Connecting...
                          </>
                        ) : (
                          'Connect'
                        )}
                      </button>
                    </div>
                  )}

                  {/* Merge user and pages into one card (deduplicated by accountId) */}
                  {(() => {
                    const fbAccounts = accounts.filter(
                      (acc) => acc.platformName === 'Facebook'
                    );

                    if (fbAccounts.length === 0) return null;

                    // Separate user from pages
                    let user = fbAccounts.find((a) => !a.accountId);
                    let pages = fbAccounts.filter((a) => a.accountId);

                    // If no user found but we have accounts with accountId, treat first as user
                    // Heuristic: user typically has multi-word name (full name) vs page (single word/brand)
                    if (!user && pages.length > 0) {
                      const sorted = [...pages].sort((a, b) => {
                        const aWords = a.username.trim().split(/\s+/).length;
                        const bWords = b.username.trim().split(/\s+/).length;
                        if (aWords > 1 && bWords === 1) return -1;
                        if (bWords > 1 && aWords === 1) return 1;
                        return 0;
                      });
                      user = sorted[0];
                      pages = pages.filter((p) => p.id !== user!.id);
                    }

                    // Dedupe pages by accountId
                    const pageMap = new Map<string, (typeof pages)[0]>();
                    for (const p of pages) {
                      const key = p.accountId || p.username || p.id;
                      if (!pageMap.has(key)) pageMap.set(key, p);
                    }
                    const uniquePages = Array.from(pageMap.values());

                    // Use user or first page for profile picture
                    const displayAccount = user || uniquePages[0];
                    if (!displayAccount) return null;

                    return (
                      <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-800/30'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            {displayAccount.profilePicture && (
                              <img
                                src={displayAccount.profilePicture}
                                alt={displayAccount.username}
                                className='h-10 w-10 rounded-full'
                              />
                            )}
                            <div>
                              <p className='font-medium text-blue-900 dark:text-blue-200'>
                                Facebook Account
                              </p>
                              {user && (
                                <p className='text-sm text-blue-700 dark:text-blue-300'>
                                  User: {user.username}
                                </p>
                              )}
                              {uniquePages.map((page) => (
                                <p
                                  key={page.id}
                                  className='text-sm text-blue-700 dark:text-blue-300'
                                >
                                  Page: {page.username}
                                </p>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDisconnect(displayAccount.id)}
                            className='rounded-lg px-4 py-2 font-medium bg-blue-200 text-blue-700 hover:bg-blue-300 dark:bg-blue-700 dark:text-blue-300 dark:hover:bg-blue-600'
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>

            {/* Placeholder for other platforms (mock for now) */}
            {[
              { name: 'Twitter', connected: false },
              { name: 'Instagram', connected: false },
              { name: 'LinkedIn', connected: false },
              { name: 'TikTok', connected: false },
            ].map((platform, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50'
              >
                <div>
                  <p className='font-medium text-slate-900 dark:text-white'>
                    {platform.name}
                  </p>
                </div>
                <button
                  disabled
                  className='rounded-lg px-4 py-2 font-medium bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'
                >
                  Coming Soon
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
            <div className='rounded-lg border border-slate-200 dark:border-slate-700 p-4'>
              <div className='flex items-center gap-2 mb-3'>
                <Lock className='h-5 w-5 text-slate-500' />
                <span className='font-medium text-slate-900 dark:text-white'>
                  Set or Update Password
                </span>
              </div>
              {updateErr && (
                <div className='mb-3 rounded-md bg-red-50 dark:bg-red-900/20 p-2 text-sm text-red-600 dark:text-red-400'>
                  {updateErr}
                </div>
              )}
              {updateMsg && (
                <div className='mb-3 rounded-md bg-green-50 dark:bg-emerald-900/20 p-2 text-sm text-emerald-700 dark:text-emerald-300'>
                  {updateMsg}
                </div>
              )}
              <div className='grid gap-3 grid-cols-1'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
                    Current Password (if set)
                  </label>
                  <input
                    type='password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder='••••••••'
                    className='w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
                    New Password
                  </label>
                  <input
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='At least 8 characters'
                    className='w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
                    Confirm Password
                  </label>
                  <input
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Repeat new password'
                    className='w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
                  />
                </div>
              </div>
              <div className='mt-3'>
                <button
                  onClick={handleUpdatePassword}
                  disabled={isUpdating}
                  className='rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60'
                >
                  {isUpdating ? 'Updating...' : 'Update Password'}
                </button>
              </div>
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
