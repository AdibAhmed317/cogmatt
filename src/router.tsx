import { createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
export const getRouter = () => {
  return createRouter({
    routeTree,
    context: {
      // auth will initially be undefined
      // We'll be passing down the auth state from within a React component
      auth: undefined!,
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
};
