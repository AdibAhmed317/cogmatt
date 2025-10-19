import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, Github, Chrome } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate({ to: '/dashboard' });
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login coming soon!`);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <div className='flex min-h-screen'>
        {/* Left Side - Form */}
        <div className='flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-24'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='mx-auto w-full max-w-md'
          >
            {/* Logo */}
            <div className='mb-8 flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500'>
                <Sparkles className='h-6 w-6 text-white' />
              </div>
              <span className='text-2xl font-bold text-slate-900 dark:text-white'>
                Cogmatt
              </span>
            </div>
            {/* Header */}
            <div className='mb-8'>
              <h1 className='mb-2 text-3xl font-bold text-slate-900 dark:text-white'>
                Welcome back
              </h1>
              <p className='text-slate-600 dark:text-slate-400'>
                Sign in to your account to continue
              </p>
            </div>
            {/* Social Login Buttons */}
            <div className='mb-6 space-y-3'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin('Google')}
                className='flex w-full items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              >
                <Chrome className='h-5 w-5' />
                Continue with Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin('GitHub')}
                className='flex w-full items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              >
                <Github className='h-5 w-5' />
                Continue with GitHub
              </motion.button>
            </div>
            {/* Divider */}
            <div className='relative mb-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-slate-200 dark:border-slate-800' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 text-slate-500 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-400'>
                  Or continue with email
                </span>
              </div>
            </div>
            {/* Login Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Email Field */}
              <div>
                <label
                  htmlFor='email'
                  className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'
                >
                  Email address
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
                  <input
                    id='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder='you@example.com'
                    className='w-full rounded-lg border-2 border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400'
                  />
                </div>
              </div>
              {/* Password Field */}
              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-slate-700 dark:text-slate-300'
                  >
                    Password
                  </label>
                  <a
                    href='#'
                    className='text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300'
                  >
                    Forgot password?
                  </a>
                </div>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
                  <input
                    id='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder='••••••••'
                    className='w-full rounded-lg border-2 border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400'
                  />
                </div>
              </div>
              {/* Remember Me */}
              <div className='flex items-center'>
                <input
                  id='remember'
                  type='checkbox'
                  className='h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700'
                />
                <label
                  htmlFor='remember'
                  className='ml-2 block text-sm text-slate-700 dark:text-slate-300'
                >
                  Remember me for 30 days
                </label>
              </div>
              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='submit'
                disabled={isLoading}
                className='w-full rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isLoading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <svg
                      className='h-5 w-5 animate-spin'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </form>
            {/* Sign Up Link */}
            <p className='mt-6 text-center text-sm text-slate-600 dark:text-slate-400'>
              Don't have an account?{' '}
              <a
                href='/signup'
                className='font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300'
              >
                Sign up for free
              </a>
            </p>
          </motion.div>
        </div>
        {/* Right Side - Hero */}
        <div className='hidden lg:block lg:w-1/2'>
          <div className='relative flex h-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-12'>
            {/* Background Pattern */}
            <div className='absolute inset-0 bg-grid-white/10' />
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className='relative z-10 text-center'
            >
              <h2 className='mb-6 text-4xl font-bold text-white'>
                Join 50,000+ users
              </h2>
              <p className='mb-8 text-xl text-indigo-100'>
                Transform your productivity with Cogmatt
              </p>
              {/* Stats */}
              <div className='grid grid-cols-3 gap-8'>
                {/*
                  { value: '99.9%', label: 'Uptime' },
                  { value: '50K+', label: 'Users' },
                  { value: '4.9/5', label: 'Rating' },
                */}
                {Array.from({ length: 3 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <div className='mb-2 text-3xl font-bold text-white'>
                      {idx === 0 ? '99.9%' : idx === 1 ? '50K+' : '4.9/5'}
                    </div>
                    <div className='text-sm text-indigo-200'>
                      {idx === 0 ? 'Uptime' : idx === 1 ? 'Users' : 'Rating'}
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Testimonial */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className='mt-12 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'
              >
                <p className='mb-4 text-white'>
                  "Cogmatt has completely transformed how our team works. We're
                  more productive than ever!"
                </p>
                <div className='flex items-center justify-center gap-3'>
                  <div className='h-10 w-10 rounded-full bg-white/20' />
                  <div className='text-left'>
                    <div className='font-semibold text-white'>
                      Sarah Johnson
                    </div>
                    <div className='text-sm text-indigo-200'>
                      CEO at TechCorp
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
