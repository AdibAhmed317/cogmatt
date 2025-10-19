import { motion } from 'framer-motion';
import { Check, X, Zap, HelpCircle } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for individuals and small projects',
      popular: false,
      features: [
        { text: 'Up to 5 projects', included: true },
        { text: '10GB storage', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Email support', included: true },
        { text: '50+ integrations', included: true },
        { text: 'Real-time collaboration', included: false },
        { text: 'Advanced security', included: false },
        { text: 'Custom workflows', included: false },
        { text: 'Priority support', included: false },
        { text: 'API access', included: false },
      ],
      cta: 'Get Started Free',
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'For professionals and growing teams',
      popular: true,
      features: [
        { text: 'Unlimited projects', included: true },
        { text: '100GB storage', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Priority email support', included: true },
        { text: '200+ integrations', included: true },
        { text: 'Real-time collaboration', included: true },
        { text: 'Advanced security', included: true },
        { text: 'Custom workflows', included: true },
        { text: 'Priority support', included: false },
        { text: 'API access', included: false },
      ],
      cta: 'Start Free Trial',
    },
    {
      name: 'Enterprise',
      price: '$99',
      description: 'For large teams with advanced needs',
      popular: false,
      features: [
        { text: 'Unlimited everything', included: true },
        { text: 'Unlimited storage', included: true },
        { text: 'Custom analytics', included: true },
        { text: '24/7 phone support', included: true },
        { text: '500+ integrations', included: true },
        { text: 'Real-time collaboration', included: true },
        { text: 'Enterprise security', included: true },
        { text: 'Custom workflows', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Full API access', included: true },
      ],
      cta: 'Contact Sales',
    },
  ];

  const faqs = [
    {
      q: 'Can I change my plan later?',
      a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we will prorate any payments.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and can set up invoicing for Enterprise customers.',
    },
    {
      q: 'Is there a free trial?',
      a: 'Yes! Pro and Enterprise plans come with a 14-day free trial. No credit card required to start.',
    },
    {
      q: 'What happens when I cancel?',
      a: 'You can cancel anytime. You will retain access until the end of your billing period, and we will never charge you again.',
    },
    {
      q: 'Do you offer student or nonprofit discounts?',
      a: 'Yes! We offer 50% off for students and registered nonprofits. Contact us with proof of eligibility.',
    },
    {
      q: 'Is my data safe?',
      a: 'Absolutely. We use bank-level 256-bit encryption, are SOC 2 compliant, and perform regular security audits.',
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
              Simple,{' '}
              <span className='bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400'>
                Transparent Pricing
              </span>
            </h1>
            <p className='mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-400'>
              Choose the perfect plan for your needs. Always know what you will
              pay.
            </p>
            {/* Billing Toggle */}
            <div className='mt-8 flex items-center justify-center gap-4'>
              <span className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Monthly
              </span>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600'>
                <span className='inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition' />
              </button>
              <span className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Annual{' '}
                <span className='ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400'>
                  Save 20%
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Pricing Cards */}
      <section className='py-24'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='grid gap-8 lg:grid-cols-3'>
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border bg-white p-8 shadow-lg transition-all hover:shadow-2xl dark:bg-slate-900 ${
                  plan.popular
                    ? 'border-indigo-500 ring-2 ring-indigo-500 dark:border-indigo-400'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {plan.popular && (
                  <div className='absolute right-4 top-4 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 px-3 py-1 text-xs font-semibold text-white'>
                    Most Popular
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
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className='flex items-center gap-3'>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          feature.included
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        {feature.included ? (
                          <Check className='h-3 w-3 text-green-600 dark:text-green-400' />
                        ) : (
                          <X className='h-3 w-3 text-slate-400 dark:text-slate-600' />
                        )}
                      </div>
                      <span
                        className={
                          feature.included
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-slate-500 dark:text-slate-500'
                        }
                      >
                        {feature.text}
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
                      : 'border-2 border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Comparison Table */}
      <section className='border-t border-slate-200 bg-slate-50 py-24 dark:border-slate-800 dark:bg-slate-900/50'>
        <div className='mx-auto max-w-7xl px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl'>
              Compare All Features
            </h2>
            <p className='text-lg text-slate-600 dark:text-slate-400'>
              See what is included in each plan
            </p>
          </motion.div>
          <div className='overflow-x-auto'>
            <table className='w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'>
              <thead className='border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white'>
                    Feature
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white'>
                    Starter
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400'>
                    Pro
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white'>
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
                {plans[0].features.map((_, idx) => (
                  <tr key={idx}>
                    <td className='px-6 py-4 text-sm text-slate-700 dark:text-slate-300'>
                      {plans[0].features[idx].text}
                    </td>
                    {plans.map((plan, planIdx) => (
                      <td key={planIdx} className='px-6 py-4 text-center'>
                        {plan.features[idx].included ? (
                          <Check className='mx-auto h-5 w-5 text-green-600 dark:text-green-400' />
                        ) : (
                          <X className='mx-auto h-5 w-5 text-slate-300 dark:text-slate-700' />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className='border-t border-slate-200 bg-white py-24 dark:border-slate-800 dark:bg-slate-950'>
        <div className='mx-auto max-w-4xl px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl'>
              Frequently Asked Questions
            </h2>
            <p className='text-lg text-slate-600 dark:text-slate-400'>
              Got questions? We have got answers.
            </p>
          </motion.div>
          <div className='space-y-4'>
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className='rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'
              >
                <div className='mb-2 flex items-start gap-3'>
                  <HelpCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600 dark:text-indigo-400' />
                  <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
                    {faq.q}
                  </h3>
                </div>
                <p className='pl-8 text-slate-600 dark:text-slate-400'>
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className='border-t border-slate-200 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 py-24 dark:border-slate-800'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Zap className='mx-auto mb-6 h-16 w-16 text-white' />
            <h2 className='mb-6 text-4xl font-bold text-white'>
              Start Your Free Trial Today
            </h2>
            <p className='mb-8 text-xl text-indigo-100'>
              No credit card required. 14-day free trial. Cancel anytime.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='rounded-lg bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-xl transition-all hover:shadow-2xl'
            >
              Get Started Free
            </motion.button>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default PricingPage;
