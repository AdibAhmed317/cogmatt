import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Send, Clock } from 'lucide-react';
import { useAuth } from '@/presentation/contexts/AuthContext';

interface SocialAccount {
  id: string;
  platformName: string;
  username: string;
  profilePicture?: string;
  accountId?: string;
}

// Simple keyword extraction & hashtag generator
function generateHashtags(text: string, max = 8): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ');
  const words = cleaned.split(/\s+/).filter(Boolean);

  const stopwords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'if',
    'then',
    'else',
    'when',
    'at',
    'by',
    'for',
    'with',
    'about',
    'against',
    'between',
    'into',
    'through',
    'during',
    'before',
    'after',
    'above',
    'below',
    'to',
    'from',
    'up',
    'down',
    'in',
    'out',
    'on',
    'off',
    'over',
    'under',
    'again',
    'further',
    'once',
    'here',
    'there',
    'all',
    'any',
    'both',
    'each',
    'few',
    'more',
    'most',
    'other',
    'some',
    'such',
    'no',
    'nor',
    'not',
    'only',
    'own',
    'same',
    'so',
    'than',
    'too',
    'very',
    's',
    't',
    'can',
    'will',
    'just',
    'don',
    'should',
    'now',
  ]);

  const freq = new Map<string, number>();
  for (const w of words) {
    if (w.length < 3 || stopwords.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  const base = [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w);
  const seededExtras = [
    'ai',
    'content',
    'marketing',
    'social',
    'growth',
    'creator',
  ];

  const candidates = [...base, ...seededExtras];
  const tags: string[] = [];
  for (const c of candidates) {
    const tag = `#${c.replace(/\s+/g, '')}`;
    if (!tags.includes(tag)) tags.push(tag);
    if (tags.length >= max) break;
  }
  return tags;
}

// LocalStorage helpers
const DRAFT_KEY = 'post-composer-v1';
const VERSIONS_KEY = 'post-composer-versions-v1';

interface VersionItem {
  id: string;
  content: string;
  createdAt: number;
}

export default function PostComposer() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [agencyId, setAgencyId] = useState<string>('');
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMsg, setPublishMsg] = useState<string | null>(null);
  const [publishErr, setPublishErr] = useState<string | null>(null);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const saveTimer = useRef<number | null>(null);

  // Load agency and social accounts
  useEffect(() => {
    const loadData = async () => {
      if (!user?.userId) return;

      // Get agency
      try {
        const res = await fetch(`/api/agency/me?ownerId=${user.userId}`);
        if (res.ok) {
          const data = await res.json();
          setAgencyId(data.agencyId);

          // Load social accounts for this agency
          setLoadingAccounts(true);
          const accountsRes = await fetch(
            `/api/social-accounts/${data.agencyId}`
          );
          if (accountsRes.ok) {
            const accountsData = await accountsRes.json();

            // Filter to only Facebook Pages (accounts with accountId)
            // User accounts without accountId cannot post
            const pagesOnly = accountsData.filter(
              (acc: SocialAccount) =>
                acc.accountId && acc.accountId.trim() !== ''
            );

            setSocialAccounts(pagesOnly);
            // Auto-select all pages by default
            setSelectedAccounts(pagesOnly.map((acc: SocialAccount) => acc.id));
          }
          setLoadingAccounts(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setLoadingAccounts(false);
      }
    };

    loadData();
  }, [user?.userId]);

  // Load from storage (client only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setContent(parsed.content || '');
        setSavedAt(parsed.savedAt || null);
      }
      const vraw = localStorage.getItem(VERSIONS_KEY);
      if (vraw) {
        const parsed: VersionItem[] = JSON.parse(vraw);
        setVersions(parsed);
      }
    } catch {}
  }, []);

  // Autosave with debounce
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        const ts = Date.now();
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ content, savedAt: ts })
        );
        setSavedAt(ts);
      } catch {}
    }, 600);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [content]);

  const hashtags = useMemo(() => generateHashtags(content), [content]);

  function saveVersion() {
    if (typeof window === 'undefined') return;
    const trimmed = content.trim();
    if (!trimmed) return;
    const newItem: VersionItem = {
      id: Math.random().toString(36).slice(2),
      content: trimmed,
      createdAt: Date.now(),
    };
    const next = [newItem, ...versions].slice(0, 5);
    setVersions(next);
    try {
      localStorage.setItem(VERSIONS_KEY, JSON.stringify(next));
    } catch {}
  }

  function restoreVersion(id: string) {
    const v = versions.find((x) => x.id === id);
    if (v) setContent(v.content);
  }

  function deleteVersion(id: string) {
    const next = versions.filter((x) => x.id !== id);
    setVersions(next);
    try {
      localStorage.setItem(VERSIONS_KEY, JSON.stringify(next));
    } catch {}
  }

  async function copyHashtags() {
    try {
      await navigator.clipboard.writeText(hashtags.join(' '));
    } catch {}
  }

  function insertHashtags() {
    const toInsert = `\n\n${hashtags.join(' ')}`;
    setContent((c) => (c.includes(hashtags[0]) ? c : c + toInsert));
  }

  function clearDraft() {
    setContent('');
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch {}
  }

  async function handlePublish(scheduleForLater: boolean = false) {
    setPublishMsg(null);
    setPublishErr(null);

    if (!content.trim()) {
      setPublishErr('Please enter some content');
      return;
    }

    if (!agencyId) {
      setPublishErr('Agency not loaded');
      return;
    }

    if (selectedAccounts.length === 0) {
      setPublishErr('Please select at least one social account');
      return;
    }

    setIsPublishing(true);

    try {
      let scheduledAt = undefined;
      if (scheduleForLater && scheduledDate && scheduledTime) {
        scheduledAt = new Date(
          `${scheduledDate}T${scheduledTime}`
        ).toISOString();
      }

      const res = await fetch('/api/posts/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyId,
          content,
          socialAccountIds: selectedAccounts,
          scheduledAt,
          publishNow: !scheduleForLater,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      // Check for partial failures
      if (data.status === 'partial') {
        const failedAccounts = data.results
          .filter((r: any) => !r.success)
          .map((r: any) => r.error)
          .join(', ');
        setPublishErr(`Partial failure: ${failedAccounts}`);
      } else if (data.status === 'failed') {
        const errors = data.results
          .map((r: any) => r.error || 'Unknown error')
          .join(', ');
        throw new Error(`Failed to publish: ${errors}`);
      }

      // Show success message with details
      const successCount = data.results.filter((r: any) => r.success).length;
      setPublishMsg(
        scheduleForLater
          ? `Post scheduled successfully to ${successCount} account(s)!`
          : `Post published successfully to ${successCount} account(s)!`
      );

      // Clear the form
      setContent('');
      clearDraft();
    } catch (error) {
      setPublishErr((error as Error).message || 'Failed to publish post');
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div
      id='composer'
      className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden'
    >
      <div className='flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800'>
        <h3 className='font-semibold text-slate-900 dark:text-white'>
          Create Post
        </h3>
        <div className='text-xs text-slate-500 dark:text-slate-400'>
          {savedAt
            ? `Autosaved ${new Date(savedAt).toLocaleTimeString()}`
            : 'Draft not saved yet'}
        </div>
      </div>
      <div className='p-4 space-y-4'>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={5}
          className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
        />

        {/* Social Accounts Selection */}
        <div>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-slate-900 dark:text-white'>
              Post to Accounts
            </div>
            <button
              onClick={async () => {
                try {
                  setLoadingAccounts(true);
                  const res = await fetch(
                    '/api/social-accounts/facebook/resync',
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                    }
                  );
                  const data = await res.json();
                  if (data.success) {
                    // Reload accounts
                    const accountsRes = await fetch(
                      `/api/social-accounts/${agencyId}`
                    );
                    if (accountsRes.ok) {
                      const accountsData = await accountsRes.json();

                      const pagesOnly = accountsData.filter(
                        (acc: SocialAccount) =>
                          acc.accountId && acc.accountId.trim() !== ''
                      );

                      setSocialAccounts(pagesOnly);
                      setSelectedAccounts(
                        pagesOnly.map((acc: SocialAccount) => acc.id)
                      );
                      alert(
                        `Synced! Created: ${data.created}, Updated: ${data.updated} pages. Found ${pagesOnly.length} pages total.`
                      );
                    }
                  } else {
                    alert(`Sync failed: ${data.error}`);
                  }
                } catch (error) {
                  console.error('Resync error:', error);
                  alert('Failed to sync pages');
                } finally {
                  setLoadingAccounts(false);
                }
              }}
              className='text-xs px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors'
              disabled={loadingAccounts}
            >
              {loadingAccounts ? 'Syncing...' : '🔄 Refresh Pages'}
            </button>
          </div>
          {loadingAccounts ? (
            <div className='text-xs text-slate-500 dark:text-slate-400'>
              Loading accounts...
            </div>
          ) : socialAccounts.length === 0 ? (
            <div className='rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3'>
              <p className='text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-1'>
                No Facebook Pages Connected
              </p>
              <p className='text-xs text-yellow-700 dark:text-yellow-300'>
                Only Facebook Pages can create posts. Please connect a Facebook
                Page in Settings → Connected Accounts, then click "Refresh
                Pages" above.
              </p>
            </div>
          ) : (
            <div className='space-y-2'>
              {socialAccounts.map((account) => (
                <label
                  key={account.id}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={selectedAccounts.includes(account.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAccounts([...selectedAccounts, account.id]);
                      } else {
                        setSelectedAccounts(
                          selectedAccounts.filter((id) => id !== account.id)
                        );
                      }
                    }}
                    className='rounded border-slate-300 text-indigo-600 focus:ring-indigo-500'
                  />
                  <div className='flex items-center gap-2'>
                    {account.profilePicture && (
                      <img
                        src={account.profilePicture}
                        alt={account.username}
                        className='h-6 w-6 rounded-full'
                      />
                    )}
                    <span className='text-sm text-slate-700 dark:text-slate-300'>
                      {account.platformName}: {account.username}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Schedule Options */}
        <div>
          <div className='text-sm font-medium text-slate-900 dark:text-white mb-2'>
            Schedule (Optional)
          </div>
          <div className='flex gap-2'>
            <input
              type='date'
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
            />
            <input
              type='time'
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white'
            />
          </div>
        </div>

        {/* Publish Buttons */}
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => handlePublish(false)}
            disabled={
              isPublishing || !content.trim() || selectedAccounts.length === 0
            }
            className='flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isPublishing ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Publishing...
              </>
            ) : (
              <>
                <Send className='h-4 w-4' />
                Publish Now
              </>
            )}
          </button>
          {scheduledDate && scheduledTime && (
            <button
              onClick={() => handlePublish(true)}
              disabled={
                isPublishing || !content.trim() || selectedAccounts.length === 0
              }
              className='flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isPublishing ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Scheduling...
                </>
              ) : (
                <>
                  <Clock className='h-4 w-4' />
                  Schedule Post
                </>
              )}
            </button>
          )}
        </div>

        {/* Success/Error Messages */}
        {publishMsg && (
          <div className='text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg'>
            {publishMsg}
          </div>
        )}
        {publishErr && (
          <div className='text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg'>
            {publishErr}
          </div>
        )}

        {/* Existing Tools */}
        <div className='border-t border-slate-200 dark:border-slate-800 pt-4'>
          <div className='flex flex-wrap gap-2 mb-4'>
            <button
              onClick={saveVersion}
              className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            >
              Save Version
            </button>
            <button
              onClick={copyHashtags}
              className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            >
              Copy Hashtags
            </button>
            <button
              onClick={insertHashtags}
              className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            >
              Insert Hashtags
            </button>
            <button
              onClick={clearDraft}
              className='rounded-lg border border-red-200 text-red-600 dark:border-red-900 px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/30'
            >
              Clear Draft
            </button>
          </div>
        </div>
        <div>
          <div className='text-sm font-medium text-slate-900 dark:text-white mb-2'>
            Suggested Hashtags
          </div>
          <div className='flex flex-wrap gap-2'>
            {hashtags.map((h) => (
              <span
                key={h}
                className='inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              >
                {h}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className='text-sm font-medium text-slate-900 dark:text-white mb-2'>
            Versions
          </div>
          {versions.length === 0 ? (
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              No versions yet. Use "Save Version" to snapshot your draft.
            </p>
          ) : (
            <ul className='space-y-2'>
              {versions.map((v) => (
                <li
                  key={v.id}
                  className='rounded-lg border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-between gap-2'
                >
                  <div className='min-w-0 flex-1'>
                    <div className='text-xs text-slate-500 dark:text-slate-400'>
                      {new Date(v.createdAt).toLocaleString()}
                    </div>
                    <div className='text-sm text-slate-900 dark:text-white truncate'>
                      {v.content}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => restoreVersion(v.id)}
                      className='rounded-md border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800'
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => deleteVersion(v.id)}
                      className='rounded-md border border-red-200 text-red-600 dark:border-red-900 px-2 py-1 text-xs hover:bg-red-50 dark:hover:bg-red-900/30'
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
