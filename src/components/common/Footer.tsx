const Footer = () => {
  return (
    <footer className='border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50'>
      <div className='mx-auto max-w-7xl px-6 py-12'>
        <div className='grid gap-8 md:grid-cols-4'>
          {/* Logo & Description */}
          <div className='md:col-span-2'>
            <div className='mb-4 flex items-center gap-2'>
              <img
                src='/logo.png'
                alt='Cogmatt logo'
                className='h-9 w-9 rounded-lg object-contain'
              />
              <span className='text-xl font-bold text-slate-900 dark:text-white'>
                Cogmatt
              </span>
            </div>
            <p className='max-w-md text-sm text-slate-600 dark:text-slate-400'>
              Cogmatt is your AI-powered platform for creating, scheduling, and
              publishing content across all your social and creator channels.
              Write once, post everywhere, grow faster.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className='mb-4 text-sm font-semibold text-slate-900 dark:text-white'>
              Product
            </h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='/features'
                  className='text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400'
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href='/pricing'
                  className='text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400'
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className='mb-4 text-sm font-semibold text-slate-900 dark:text-white'>
              Company
            </h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400'
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400'
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400'
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 border-t border-slate-200 pt-8 dark:border-slate-800'>
          <p className='text-center text-sm text-slate-600 dark:text-slate-400'>
            © 2025 Cogmatt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
