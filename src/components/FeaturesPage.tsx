import { motion } from 'framer-motion';
import {
  Zap,
  Sparkles,
  Users,
  BarChart,
  Lock,
  Cloud,
  Headphones,
  Calendar,
} from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Sparkles className='h-8 w-8' />,
      title: 'AI-Powered Content Generation',
      description:
        'Effortlessly create engaging posts, captions, and articles for all your social and content platforms using advanced AI.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Zap className='h-8 w-8' />,
      title: 'One-Click Multi-Platform Posting',
      description:
        'Publish your content instantly across Twitter, Facebook, Instagram, LinkedIn, YouTube, and more with a single click.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: <Calendar className='h-8 w-8' />,
      title: 'Smart Scheduling',
      description:
        'Let AI pick the best time to post for maximum reach and engagement on every platform.',
      color: 'from-violet-500 to-indigo-500',
    },
    {
      icon: <BarChart className='h-8 w-8' />,
      title: 'Performance Analytics',
      description:
        'Track likes, shares, comments, and growth across all your channels in one dashboard.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Users className='h-8 w-8' />,
      title: 'Collaboration Tools',
      description:
        'Invite your team, assign roles, and work together on campaigns and content calendars.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Cloud className='h-8 w-8' />,
      title: 'Cloud Sync & Mobile Access',
      description:
        'Access your content and analytics anywhere, anytime. Mobile apps coming soon.',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: <Lock className='h-8 w-8' />,
      title: 'Privacy & Security',
      description:
        'Your data is protected with industry-leading security and privacy standards.',
      color: 'from-slate-600 to-slate-800',
    },
    {
      icon: <Headphones className='h-8 w-8' />,
      title: 'Priority Support',
      description:
        'Get help from our expert team whenever you need it. Average response time under 1 hour.',
      color: 'from-rose-500 to-pink-500',
    },
  ];

  return (
    <div className='min-h-screen bg-white dark:bg-slate-950'>
      <Navbar />
      {/* Hero Section */}
      <section className='relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white py-24 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950'>
        <div className='absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25' />
        <div className='relative mx-auto max-w-7xl px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center'
          >
            <h1 className='mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl lg:text-7xl'>
              Powerful Features for
              <span className='bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400'>
                {' '}
                Modern Teams
              </span>
            </h1>
            <p className='mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-400'>
              Everything you need to supercharge your productivity, streamline
              your workflow, and achieve more together.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Features Grid */}
      <section className='py-24'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900'
              >
                {/* Icon */}
                <div
                  className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white shadow-lg`}
                >
                  {feature.icon}
                </div>
                {/* Content */}
                <h3 className='mb-3 text-xl font-bold text-slate-900 dark:text-white'>
                  {feature.title}
                </h3>
                <p className='text-slate-600 dark:text-slate-400'>
                  {feature.description}
                </p>
                {/* Hover Effect */}
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity group-hover:opacity-5`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Integration Showcase */}
      <section className='border-t border-slate-200 bg-slate-50 py-24 dark:border-slate-800 dark:bg-slate-900/50'>
        <div className='mx-auto max-w-7xl px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl'>
              Publish Everywhere Instantly
            </h2>
            <p className='mb-4 text-lg text-slate-600 dark:text-slate-400'>
              Cogmatt connects to all major social and content platforms so you
              can create once and share everywhere. No more copy-paste or manual
              posting.
            </p>
            <p className='text-lg text-slate-600 dark:text-slate-400'>
              Supported platforms include:
            </p>
          </motion.div>
          <div className='grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6'>
            {[
              'Twitter',
              'Facebook',
              'Instagram',
              'LinkedIn',
              'YouTube',
              'Pinterest',
              'TikTok',
              'Medium',
              'Reddit',
              'WordPress',
              'Substack',
              'Tumblr',
            ].map((platform, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className='flex h-24 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ring-2 ring-indigo-400'
              >
                <span className='text-lg font-semibold text-slate-600 dark:text-slate-400'>
                  {platform}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className='border-t border-slate-200 bg-white py-24 dark:border-slate-800 dark:bg-slate-950'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className='mb-6 text-4xl font-bold text-slate-900 dark:text-white'>
              Ready to Experience These Features?
            </h2>
            <p className='mb-8 text-xl text-slate-600 dark:text-slate-400'>
              Start your free 14-day trial today. No credit card required.
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl'
                onClick={() => (window.location.href = '/signup')}
              >
                Sign up for free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='rounded-lg border-2 border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
