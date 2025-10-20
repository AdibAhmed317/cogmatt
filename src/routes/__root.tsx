import {
  HeadContent,
  Outlet,
  createRootRoute,
  Scripts,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import appCss from '@/styles.css?url';
import { ThemeProvider } from '@/application/lib/theme-provider';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Cogmatt - Create, Post & Grow with AI',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/logo.png',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider defaultTheme='system' storageKey='cogmatt-theme'>
        <Outlet />
      </ThemeProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='en'>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundComponent() {
  return (
    <RootDocument>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: '0.5rem',
          }}
        >
          Page not found
        </h1>
        <p style={{ marginBottom: '1rem' }}>
          The page you are looking for does not exist or may have been moved.
        </p>
        <a href='/' style={{ color: 'var(--link-color, #2563eb)' }}>
          Go back home
        </a>
      </div>
    </RootDocument>
  );
}
