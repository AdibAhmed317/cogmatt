import { useEffect, useMemo, useRef, useState } from 'react';

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
  const [content, setContent] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const saveTimer = useRef<number | null>(null);

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
        <div className='flex flex-wrap gap-2'>
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
            className='rounded-lg bg-indigo-600 text-white px-3 py-1.5 text-sm hover:bg-indigo-700'
          >
            Insert Hashtags
          </button>
          <button
            onClick={clearDraft}
            className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
          >
            Clear Draft
          </button>
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
