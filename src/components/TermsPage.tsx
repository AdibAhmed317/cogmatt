import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useEffect } from 'react';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const lastUpdated = 'November 8, 2025';

  return (
    <div className='min-h-screen bg-white dark:bg-slate-950'>
      <Navbar />
      <main className='mx-auto max-w-4xl px-6 py-16'>
        <header className='mb-12'>
          <h1 className='mb-4 text-4xl font-bold text-slate-900 dark:text-white'>
            Terms & Conditions
          </h1>
          <p className='text-slate-600 dark:text-slate-400'>
            These Terms & Conditions ("Terms") govern your access to and use of
            the Cogmatt platform (the "Service"). By creating an account or
            using the Service you agree to be bound by these Terms.
          </p>
          <p className='mt-2 text-xs text-slate-500 dark:text-slate-500'>
            Last updated: {lastUpdated}
          </p>
        </header>

        <nav
          aria-label='Table of contents'
          className='mb-12 rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm dark:border-slate-800 dark:bg-slate-900/40'
        >
          <ol className='grid gap-2 sm:grid-cols-2'>
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className='text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400'
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className='space-y-12'>
          {sections.map((s) => (
            <section key={s.id} id={s.id} className='scroll-mt-24'>
              <h2 className='mb-4 text-2xl font-semibold text-slate-800 dark:text-slate-200'>
                {s.title}
              </h2>
              <div className='space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
                {s.content}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import type { ReactNode } from 'react';

interface TermsSection {
  id: string;
  title: string;
  content: ReactNode;
}

const sections: TermsSection[] = [
  {
    id: 'acceptance-of-terms',
    title: 'Acceptance of Terms',
    content: (
      <p>
        By accessing or using Cogmatt you agree to these Terms and our Privacy
        Policy. If you do not agree, you must discontinue use. These Terms apply
        to all visitors, users, and others who access the Service.
      </p>
    ),
  },
  {
    id: 'eligibility-and-accounts',
    title: 'Eligibility & Accounts',
    content: (
      <p>
        You must be at least 16 years old (or the age of digital consent in your
        jurisdiction) to create an account. You are responsible for safeguarding
        login credentials and for all activity that occurs under your account.
        Notify us immediately of any unauthorized use.
      </p>
    ),
  },
  {
    id: 'subscriptions-and-payment',
    title: 'Subscriptions & Payment',
    content: (
      <p>
        Paid features require an active subscription. Fees are billed in advance
        on a recurring basis and are non-refundable except where required by
        law. Downgrades take effect at the end of the current billing cycle.
      </p>
    ),
  },
  {
    id: 'ai-generated-content-disclaimer',
    title: 'AI Generated Content Disclaimer',
    content: (
      <p>
        AI output may contain inaccuracies or bias. You are responsible for
        reviewing generated content for compliance with platform rules, laws,
        and brand guidelines. We do not guarantee performance or reach of
        AI-generated posts.
      </p>
    ),
  },
  {
    id: 'content-ownership-and-license',
    title: 'Content Ownership & License',
    content: (
      <p>
        You retain ownership of content you create. You grant Cogmatt a
        non-exclusive, worldwide, royalty-free license to store, process, and
        display your content solely to operate and improve the Service.
      </p>
    ),
  },
  {
    id: 'user-conduct',
    title: 'User Conduct',
    content: (
      <p>
        Use the Service responsibly: respect intellectual property, avoid
        misleading practices, and connect only accounts you are authorized to
        manage.
      </p>
    ),
  },
  {
    id: 'prohibited-uses',
    title: 'Prohibited Uses',
    content: (
      <ul className='list-disc space-y-1 pl-5'>
        <li>Platform rate-limit evasion or spam automation.</li>
        <li>Hateful, harassing, or illegal content.</li>
        <li>Reverse engineering non-public parts of the Service.</li>
        <li>Bypassing usage limits or security controls.</li>
        <li>Uploading malware or conducting denial of service attacks.</li>
      </ul>
    ),
  },
  {
    id: 'platform-integrations-and-apis',
    title: 'Platform Integrations & APIs',
    content: (
      <p>
        Third-party APIs (Meta, Google, LinkedIn, etc.) are subject to their own
        terms. Revoked tokens or policy changes can impact functionality;
        Cogmatt is not liable for external outages.
      </p>
    ),
  },
  {
    id: 'data-privacy-and-security',
    title: 'Data Privacy & Security',
    content: (
      <p>
        We apply industry-standard safeguards (encryption in transit, access
        controls). No system is perfectly secure; you accept inherent internet
        transmission risks. See forthcoming Privacy Policy for details.
      </p>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: (
      <p>
        Cogmatt trademarks, UI, algorithms, and branding are protected. Do not
        copy or create derivative works without permission.
      </p>
    ),
  },
  {
    id: 'beta-and-experimental-features',
    title: 'Beta & Experimental Features',
    content: (
      <p>
        Beta features may change or be removed without notice and are provided
        "as is" for evaluation purposes.
      </p>
    ),
  },
  {
    id: 'termination',
    title: 'Termination',
    content: (
      <p>
        You may cancel anytime. We may suspend or terminate accounts for
        violations. Backups and logs may be retained as required by law.
      </p>
    ),
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    content: (
      <p>
        THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS
        OR IMPLIED, INCLUDING FITNESS FOR A PARTICULAR PURPOSE OR
        NON-INFRINGEMENT.
      </p>
    ),
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    content: (
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, COGMATT IS NOT LIABLE FOR
        INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOSS OF
        PROFITS, DATA, OR USE.
      </p>
    ),
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    content: (
      <p>
        You agree to indemnify Cogmatt against claims arising from your content,
        misuse of the Service, or violation of these Terms.
      </p>
    ),
  },
  {
    id: 'changes-to-the-service-and-terms',
    title: 'Changes to the Service & Terms',
    content: (
      <p>
        We may modify features or update Terms. Material changes will be
        communicated; continued use signifies acceptance.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: (
      <p>
        Governed by the laws of the jurisdiction where Cogmatt is registered,
        excluding conflict-of-law rules.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    content: (
      <p>
        Questions? Email{' '}
        <a
          href='mailto:legal@cogmatt.com'
          className='text-indigo-600 dark:text-indigo-400'
        >
          legal@cogmatt.com
        </a>
        .
      </p>
    ),
  },
];
