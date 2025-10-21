'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Calendar,
  BarChart3,
  Check,
  ArrowRight,
  Star,
} from 'lucide-react';
import Navbar from './common/Navbar';
import { useNavigate } from '@tanstack/react-router';
import Footer from './common/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900'>
      <Navbar />

      {/* Hero Section */}
      <section className='relative overflow-hidden px-6 pt-20 pb-32'>
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950/20 dark:via-slate-950 dark:to-blue-950/20' />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

        <div className='relative mx-auto max-w-7xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center'
          >
            <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'>
              <Sparkles className='h-4 w-4' />
              Powered by AI
            </div>

            <h1 className='mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl'>
              Create, Post & Grow
              <br />
              <span className='bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent'>
                with AI.
              </span>
            </h1>

            <p className='mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-400'>
              Cogmatt helps you generate, schedule, and optimize your social
              media content—all in one place.
            </p>

            <div className='flex flex-wrap items-center justify-center gap-4'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40'
                onClick={() => navigate({ to: '/login' })}
              >
                Get Started
                <ArrowRight className='h-5 w-5' />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 px-8 py-4 font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:shadow-xl hover:shadow-green-500/40'
                onClick={() => navigate({ to: '/signup' })}
              >
                Sign Up
                <ArrowRight className='h-5 w-5' />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='rounded-lg border-2 border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition-all hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-700'
                onClick={() => navigate({ to: '/user' })}
              >
                View API Demo
              </motion.button>
            </div>

            <p className='mt-8 text-sm text-slate-500 dark:text-slate-500'>
              Used by 500+ marketers and creators worldwide
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='mt-16'
          >
            <div className='relative mx-auto max-w-5xl'>
              <div className='absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-blue-500 opacity-20 blur-3xl' />
              <div className='relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900'>
                <div className='flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50'>
                  <div className='h-3 w-3 rounded-full bg-red-400' />
                  <div className='h-3 w-3 rounded-full bg-yellow-400' />
                  <div className='h-3 w-3 rounded-full bg-green-400' />
                </div>
                <div className='aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-950 dark:to-blue-950 overflow-hidden'>
                  <img
                    src='/assets/hero.png'
                    alt='Cogmatt Dashboard Preview'
                    className='h-full w-full object-fill'
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='px-6 py-24'>
        <div className='mx-auto max-w-7xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='mb-16 text-center'
          >
            <h2 className='mb-4 text-4xl font-bold text-slate-900 dark:text-white'>
              Everything you need to succeed
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400'>
              Powerful features to help you create, manage, and grow your social
              media presence.
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                icon: Sparkles,
                title: 'AI Post Generator',
                description:
                  'Instantly create posts with tone and style. Let AI craft engaging content that resonates with your audience.',
                gradient: 'from-indigo-500 to-purple-500',
              },
              {
                icon: Zap,
                title: 'Cross-Platform Posting',
                description:
                  'Publish everywhere from one dashboard. Connect all your social accounts and post simultaneously.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Calendar,
                title: 'Smart Scheduling',
                description:
                  'Post at the perfect time with AI insights. Optimize your posting schedule for maximum engagement.',
                gradient: 'from-violet-500 to-indigo-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900'
              >
                <div
                  className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3`}
                >
                  <feature.icon className='h-6 w-6 text-white' />
                </div>

                <h3 className='mb-3 text-xl font-semibold text-slate-900 dark:text-white'>
                  {feature.title}
                </h3>

                <p className='text-slate-600 dark:text-slate-400'>
                  {feature.description}
                </p>

                <div className='absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className='px-6 py-24 bg-slate-50 dark:bg-slate-900/50'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className='mb-6 text-4xl font-bold text-slate-900 dark:text-white'>
                Manage content like a pro.
              </h2>
              <p className='mb-8 text-lg text-slate-600 dark:text-slate-400'>
                Create, schedule, and track everything with one simple workflow.
                Our intuitive dashboard puts you in control.
              </p>

              <div className='space-y-4'>
                {[
                  'Unified content calendar',
                  'Real-time analytics and insights',
                  'Team collaboration tools',
                  'Multi-account management',
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className='flex items-center gap-3'
                  >
                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30'>
                      <Check className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
                    </div>
                    <span className='text-slate-700 dark:text-slate-300'>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='relative'
            >
              <div className='absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-blue-500 opacity-20 blur-3xl' />
              <div className='relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900'>
                <div className='aspect-[5/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900'>
                  <div className='flex h-full items-center justify-center'>
                    <img
                      src='/assets/posts.png'
                      alt='Dashboard Showcase'
                      className='absolute h-full w-full object-fill'
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='px-6 py-24'>
        <div className='mx-auto max-w-7xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='mb-16 text-center'
          >
            <h2 className='mb-4 text-4xl font-bold text-slate-900 dark:text-white'>
              Loved by creators worldwide
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400'>
              See what our users have to say about Cogmatt.
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                quote:
                  'Cogmatt saved me hours every week! The AI content generator is absolutely brilliant.',
                author: 'Sarah Chen',
                role: 'Content Creator',
                avatar: 'SC',
              },
              {
                quote:
                  'Finally, a tool that understands what marketers need. The scheduling feature is a game-changer.',
                author: 'Marcus Rodriguez',
                role: 'Social Media Manager',
                avatar: 'MR',
              },
              {
                quote:
                  "I've tried many tools, but Cogmatt's simplicity and power are unmatched. Highly recommended!",
                author: 'Emily Thompson',
                role: 'Digital Marketer',
                avatar: 'ET',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900'
              >
                <div className='mb-4 flex gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='h-5 w-5 fill-yellow-400 text-yellow-400'
                    />
                  ))}
                </div>

                <p className='mb-6 text-slate-700 dark:text-slate-300'>
                  "{testimonial.quote}"
                </p>

                <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-semibold text-white'>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className='font-semibold text-slate-900 dark:text-white'>
                      {testimonial.author}
                    </div>
                    <div className='text-sm text-slate-500 dark:text-slate-400'>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className='px-6 py-24 bg-slate-50 dark:bg-slate-900/50'>
        <div className='mx-auto max-w-7xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='mb-16 text-center'
          >
            <h2 className='mb-4 text-4xl font-bold text-slate-900 dark:text-white'>
              Simple, transparent pricing
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400'>
              Choose the plan that works best for you. All plans include a
              14-day free trial.
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                name: 'Free',
                price: '$0',
                description: 'Perfect for trying out Cogmatt',
                features: [
                  '5 AI-generated posts/month',
                  '1 social account',
                  'Basic scheduling',
                  'Email support',
                ],
                cta: 'Get Started',
                popular: false,
              },
              {
                name: 'Pro',
                price: '$19',
                description: 'For serious content creators',
                features: [
                  'Unlimited AI posts',
                  '5 social accounts',
                  'Advanced scheduling',
                  'Analytics dashboard',
                  'Priority support',
                  'Custom branding',
                ],
                cta: 'Start Free Trial',
                popular: true,
              },
              {
                name: 'Business',
                price: '$49',
                description: 'For teams and agencies',
                features: [
                  'Everything in Pro',
                  'Unlimited accounts',
                  'Team collaboration',
                  'White-label reports',
                  'Dedicated support',
                  'API access',
                ],
                cta: 'Start Free Trial',
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative overflow-hidden rounded-2xl border p-8 shadow-lg transition-all ${
                  plan.popular
                    ? 'border-indigo-500 bg-white ring-2 ring-indigo-500 dark:bg-slate-900'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                {plan.popular && (
                  <div className='absolute right-4 top-4 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 px-3 py-1 text-xs font-semibold text-white'>
                    Recommended
                  </div>
                )}

                <div className='mb-6'>
                  <h3 className='mb-2 text-2xl font-bold text-slate-900 dark:text-white'>
                    {plan.name}
                  </h3>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    {plan.description}
                  </p>
                </div>

                <div className='mb-6'>
                  <span className='text-5xl font-bold text-slate-900 dark:text-white'>
                    {plan.price}
                  </span>
                  <span className='text-slate-600 dark:text-slate-400'>
                    /month
                  </span>
                </div>

                <ul className='mb-8 space-y-3'>
                  {plan.features.map((feature) => (
                    <li key={feature} className='flex items-center gap-3'>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30'>
                        <Check className='h-3 w-3 text-indigo-600 dark:text-indigo-400' />
                      </div>
                      <span className='text-slate-700 dark:text-slate-300'>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full rounded-lg py-3 font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl'
                      : 'border-2 border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='border-t border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/50'>
        <div className='mx-auto max-w-7xl px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center'
          >
            <h2 className='mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl'>
              Trusted by Industry Leaders
            </h2>
            <p className='mb-16 text-lg text-slate-600 dark:text-slate-400'>
              Our numbers speak for themselves
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-4'>
            {[
              {
                value: '10K+',
                label: 'Creators Served',
                change: 'Growing every day',
              },
              {
                value: '99.9%',
                label: 'Uptime',
                change: 'Always available',
              },
              {
                value: '1M+',
                label: 'Posts Published',
                change: 'Across all platforms',
              },
              {
                value: '4.9/5',
                label: 'User Rating',
                change: 'From real creators',
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className='text-center'
              >
                <div className='mb-2 text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400'>
                  {stat.value}
                </div>
                <div className='mb-1 text-lg font-semibold text-slate-900 dark:text-white'>
                  {stat.label}
                </div>
                <div className='text-sm text-slate-600 dark:text-slate-400'>
                  {stat.change}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Logos */}
      <section className='border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900'>
        <div className='mx-auto max-w-7xl px-6'>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className='mb-12 text-center text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'
          >
            Trusted by forward-thinking companies worldwide
          </motion.p>
          <div className='grid grid-cols-2 gap-8 md:grid-cols-5'>
            {['Twitter', 'Instagram', 'YouTube', 'LinkedIn', 'Medium'].map(
              (platform, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className='flex items-center justify-center'
                >
                  <div className='text-2xl font-bold text-slate-400 dark:text-slate-600'>
                    {platform}
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='border-t border-slate-200 bg-slate-50 py-24 dark:border-slate-800 dark:bg-slate-900/50'>
        <div className='mx-auto max-w-7xl px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl'>
              Get Started in Minutes
            </h2>
            <p className='text-lg text-slate-600 dark:text-slate-400'>
              Three simple steps to transform your productivity
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                step: '01',
                title: 'Sign Up Free',
                description:
                  'Create your account in seconds. No credit card required for trial.',
                icon: '🚀',
              },
              {
                step: '02',
                title: 'Customize Your Workspace',
                description:
                  'Set up your projects, invite your team, and configure your workflow.',
                icon: '⚡',
              },
              {
                step: '03',
                title: 'Start Achieving',
                description:
                  'Watch your productivity soar with our intelligent automation and insights.',
                icon: '✨',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className='relative'
              >
                <div className='mb-4 text-6xl opacity-10 dark:opacity-5'>
                  {item.step}
                </div>
                <div className='mb-4 text-5xl'>{item.icon}</div>
                <h3 className='mb-3 text-xl font-bold text-slate-900 dark:text-white'>
                  {item.title}
                </h3>
                <p className='text-slate-600 dark:text-slate-400'>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className='border-t border-slate-200 bg-white py-24 dark:border-slate-800 dark:bg-slate-900'>
        <div className='mx-auto max-w-5xl px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl'>
              Why Choose Cogmatt?
            </h2>
            <p className='text-lg text-slate-600 dark:text-slate-400'>
              See how we compare to traditional solutions
            </p>
          </motion.div>

          <div className='overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800'>
            <table className='w-full'>
              <thead className='bg-slate-50 dark:bg-slate-800/50'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white'>
                    Feature
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white'>
                    Cogmatt
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white'>
                    Traditional
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: 'Real-time Collaboration',
                    cogmatt: '✓',
                    traditional: 'Limited',
                  },
                  {
                    feature: 'Automated Workflows',
                    cogmatt: 'Unlimited',
                    traditional: 'Basic',
                  },
                  {
                    feature: 'Custom Integrations',
                    cogmatt: '500+',
                    traditional: '< 50',
                  },
                  {
                    feature: 'Support Response',
                    cogmatt: '< 1 hour',
                    traditional: '24-48 hours',
                  },
                ].map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className='bg-white dark:bg-slate-900'
                  >
                    <td className='px-6 py-4 text-sm font-medium text-slate-900 dark:text-white'>
                      {row.feature}
                    </td>
                    <td className='px-6 py-4 text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400'>
                      {row.cogmatt}
                    </td>
                    <td className='px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400'>
                      {row.traditional}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div className='grid gap-6 md:grid-cols-2'>
              {[
                {
                  q: 'How long does the free trial last?',
                  a: 'Our free trial lasts 14 days with full access to all Pro features. No credit card required.',
                },
                {
                  q: 'Can I cancel my subscription anytime?',
                  a: 'Absolutely! You can cancel your subscription at any time with no penalties or hidden fees.',
                },
                {
                  q: 'Which platforms can I post to?',
                  a: 'Cogmatt supports all major social and content platforms including Twitter, Instagram, YouTube, LinkedIn, Medium, and more.',
                },
                {
                  q: 'Is my data secure?',
                  a: 'Your content and account data are protected with industry-leading security and privacy standards.',
                },
                {
                  q: 'Can I collaborate with my team?',
                  a: 'Yes! Invite team members, assign roles, and work together on campaigns and content calendars.',
                },
                {
                  q: 'Do you provide onboarding or support?',
                  a: 'All paid plans include onboarding sessions, video tutorials, and priority support from our team.',
                },
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className='rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'
                >
                  <h3 className='mb-2 text-lg font-semibold text-slate-900 dark:text-white'>
                    {faq.q}
                  </h3>
                  <p className='text-slate-600 dark:text-slate-400'>{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='px-6 py-24'>
        <div className='mx-auto max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-12 text-center shadow-2xl'
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            <div className='relative'>
              <h2 className='mb-4 text-4xl font-bold text-white'>
                Start creating with AI today.
              </h2>
              <p className='mb-8 text-lg text-indigo-100'>
                Join thousands of creators who are already growing their social
                media presence with Cogmatt.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-indigo-600 shadow-lg transition-all hover:shadow-xl'
              >
                Try Cogmatt Free
                <ArrowRight className='h-5 w-5' />
              </motion.button>

              <p className='mt-4 text-sm text-indigo-200'>
                No credit card required • 14-day free trial
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
