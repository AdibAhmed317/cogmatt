import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, Github, Chrome } from 'lucide-react';
import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Signup functionality coming soon!');
    }, 1500);
  };

  const handleSocialSignup = (provider: string) => {
    alert(`${provider} signup coming soon!`);
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
                Create your account
              </h1>
              <p className='text-slate-600 dark:text-slate-400'>
                Sign up to start creating and posting everywhere
              </p>
            </div>
            {/* Social Signup Buttons */}
            <div className='mb-6 space-y-3'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialSignup('Google')}
                className='flex w-full items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              >
                <Chrome className='h-5 w-5' />
                Sign up with Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialSignup('GitHub')}
                className='flex w-full items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              >
                <Github className='h-5 w-5' />
                Sign up with GitHub
              </motion.button>
            </div>
            {/* Divider */}
            <div className='relative mb-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-slate-200 dark:border-slate-800' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 text-slate-500 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-400'>
                  Or sign up with email
                </span>
              </div>
            </div>
            {/* Signup Form */}
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
                <label
                  htmlFor='password'
                  className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'
                >
                  Password
                </label>
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
              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor='confirmPassword'
                  className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'
                >
                  Confirm Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
                  <input
                    id='confirmPassword'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder='••••••••'
                    className='w-full rounded-lg border-2 border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400'
                  />
                </div>
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
                    Signing up...
                  </span>
                ) : (
                  'Sign up'
                )}
              </motion.button>
            </form>
            {/* Login Link */}
            <p className='mt-6 text-center text-sm text-slate-600 dark:text-slate-400'>
              Already have an account?{' '}
              <a
                href='/login'
                className='font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300'
              >
                Log in
              </a>
            </p>
          </motion.div>
        </div>
        {/* Right Side - Hero */}
        <div className='hidden lg:block lg:w-1/2'>
          <div className='flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950/20 dark:via-slate-950 dark:to-blue-950/20'>
            <div className='text-center'>
              <div className='mb-8 flex items-center justify-center gap-2'>
                <Sparkles className='h-10 w-10 text-indigo-500 dark:text-indigo-400' />
                <span className='text-3xl font-bold text-slate-900 dark:text-white'>
                  Cogmatt
                </span>
              </div>
              <h2 className='mb-4 text-2xl font-bold text-slate-900 dark:text-white'>
                All your content, everywhere
              </h2>
              <p className='mx-auto max-w-md text-lg text-slate-600 dark:text-slate-400'>
                Create, schedule, and post to every platform from one dashboard.
                Start your free trial today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
