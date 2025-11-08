import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className='text-slate-600 dark:text-slate-400'>
            This Privacy Policy describes how Cogmatt ("we", "us", or "our")
            collects, uses, and protects your personal information when you use
            our platform (the "Service"). Your privacy is important to us.
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

interface PrivacySection {
  id: string;
  title: string;
  content: ReactNode;
}

const sections: PrivacySection[] = [
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: (
      <>
        <p>
          We collect information you provide directly when creating an account
          and using the Service:
        </p>
        <ul className='list-disc space-y-1 pl-5'>
          <li>
            <strong>Account Information:</strong> Name, email address, password
            (hashed), and profile details.
          </li>
          <li>
            <strong>Content:</strong> Posts, captions, images, and other content
            you create or schedule.
          </li>
          <li>
            <strong>Connected Accounts:</strong> OAuth tokens and metadata from
            linked social platforms (Facebook, Instagram, LinkedIn, X/Twitter,
            etc.).
          </li>
          <li>
            <strong>Usage Data:</strong> Log data, IP addresses, device
            information, browser type, and interaction patterns.
          </li>
          <li>
            <strong>Payment Information:</strong> Billing details processed via
            third-party payment providers (we do not store full credit card
            numbers).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use-your-information',
    title: 'How We Use Your Information',
    content: (
      <>
        <p>We use collected information to:</p>
        <ul className='list-disc space-y-1 pl-5'>
          <li>Provide, operate, and improve the Service.</li>
          <li>
            Generate AI-powered content suggestions and schedule posts to your
            connected accounts.
          </li>
          <li>Process payments and manage subscriptions.</li>
          <li>
            Send service updates, security alerts, and support communications.
          </li>
          <li>
            Analyze usage patterns to optimize features and user experience.
          </li>
          <li>Detect and prevent fraud, abuse, or security incidents.</li>
          <li>
            Comply with legal obligations and enforce our Terms of Service.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'information-sharing-and-disclosure',
    title: 'Information Sharing & Disclosure',
    content: (
      <>
        <p>
          We do not sell your personal information. We may share data in the
          following cases:
        </p>
        <ul className='list-disc space-y-1 pl-5'>
          <li>
            <strong>Third-Party Platforms:</strong> With your consent, we
            transmit content to connected social accounts (Meta, Google,
            LinkedIn, etc.) via their APIs.
          </li>
          <li>
            <strong>Service Providers:</strong> Trusted vendors for hosting,
            analytics, payment processing, and email delivery (e.g., AWS,
            Stripe, SendGrid).
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law, subpoena,
            or to protect rights and safety.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of a merger,
            acquisition, or sale of assets, user data may be transferred to the
            acquiring entity.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: (
      <p>
        We retain your data for as long as your account is active or as needed
        to provide services. Upon account deletion, we remove personal data
        within 90 days, except for data retained for legal, tax, or security
        purposes. Backups may persist for up to 180 days.
      </p>
    ),
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: (
      <p>
        We employ industry-standard security measures including encryption in
        transit (TLS), encryption at rest for sensitive data, role-based access
        controls, and regular security audits. However, no system is 100%
        secure; you acknowledge the inherent risks of internet transmission.
      </p>
    ),
  },
  {
    id: 'your-rights-and-choices',
    title: 'Your Rights & Choices',
    content: (
      <>
        <p>
          Depending on your jurisdiction, you may have the following rights:
        </p>
        <ul className='list-disc space-y-1 pl-5'>
          <li>
            <strong>Access:</strong> Request a copy of your personal data.
          </li>
          <li>
            <strong>Correction:</strong> Update inaccurate or incomplete
            information via account settings.
          </li>
          <li>
            <strong>Deletion:</strong> Request account and data deletion
            (subject to legal retention).
          </li>
          <li>
            <strong>Portability:</strong> Export your content in a
            machine-readable format.
          </li>
          <li>
            <strong>Objection:</strong> Object to processing for direct
            marketing or legitimate interests.
          </li>
          <li>
            <strong>Revoke Consent:</strong> Disconnect social accounts or
            withdraw permissions at any time.
          </li>
        </ul>
        <p className='mt-2'>
          To exercise these rights, contact us at{' '}
          <a
            href='mailto:privacy@cogmatt.com'
            className='text-indigo-600 dark:text-indigo-400'
          >
            privacy@cogmatt.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'cookies-and-tracking',
    title: 'Cookies & Tracking Technologies',
    content: (
      <p>
        We use cookies, local storage, and similar technologies to maintain
        sessions, remember preferences, and analyze site traffic. Essential
        cookies are required for the Service to function. You can control
        non-essential cookies via browser settings, but disabling them may
        affect functionality.
      </p>
    ),
  },
  {
    id: 'third-party-services',
    title: 'Third-Party Services',
    content: (
      <p>
        The Service integrates with third-party platforms (Meta, Google,
        LinkedIn, X/Twitter, etc.). Each provider has its own privacy policy
        governing data they collect when you authorize connections. We are not
        responsible for their practices.
      </p>
    ),
  },
  {
    id: 'international-data-transfers',
    title: 'International Data Transfers',
    content: (
      <p>
        Your data may be transferred to and processed in countries other than
        your residence. We ensure adequate safeguards (e.g., Standard
        Contractual Clauses) for cross-border transfers where required by law.
      </p>
    ),
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    content: (
      <p>
        The Service is not intended for users under 16 (or the applicable age of
        digital consent). We do not knowingly collect data from children. If you
        believe a child has provided information, contact us immediately.
      </p>
    ),
  },
  {
    id: 'changes-to-this-policy',
    title: 'Changes to This Policy',
    content: (
      <p>
        We may update this Privacy Policy periodically. Material changes will be
        communicated via email or in-app notification. Continued use after
        changes constitutes acceptance.
      </p>
    ),
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    content: (
      <p>
        Questions or concerns? Reach out at{' '}
        <a
          href='mailto:privacy@cogmatt.com'
          className='text-indigo-600 dark:text-indigo-400'
        >
          privacy@cogmatt.com
        </a>{' '}
        or visit our support center.
      </p>
    ),
  },
  {
    id: 'gdpr-and-ccpa-compliance',
    title: 'GDPR & CCPA Compliance',
    content: (
      <>
        <p>
          <strong>For EU/EEA Users (GDPR):</strong> You have rights to access,
          rectify, erase, restrict processing, data portability, and lodge
          complaints with a supervisory authority. Our lawful basis for
          processing includes contract performance, consent, and legitimate
          interests.
        </p>
        <p className='mt-2'>
          <strong>For California Residents (CCPA):</strong> You have the right
          to know what personal information is collected, request deletion, and
          opt-out of sale (we do not sell personal information). Contact us to
          exercise these rights without discrimination.
        </p>
      </>
    ),
  },
];
