import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/application/lib/theme-provider';
import { useState, useRef, useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
        aria-label='Toggle theme'
      >
        <CurrentIcon className='h-5 w-5 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400' />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-40 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg z-50'>
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value as 'light' | 'dark' | 'system');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  theme === themeOption.value
                    ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className='h-4 w-4' />
                <span className='text-sm'>{themeOption.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
