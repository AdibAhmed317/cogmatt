# Cogmatt

**Create, Post & Grow with AI** — A modern social media content management platform built with TanStack Start.

![Built with TanStack Start](https://img.shields.io/badge/Built%20with-TanStack%20Start-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## 🚀 Features

- **AI Post Generator** - Instantly create posts with tone and style
- **Cross-Platform Posting** - Publish everywhere from one dashboard
- **Smart Scheduling** - Post at the perfect time with AI insights
- **Clean Architecture** - Domain-driven design with repository pattern
- **Type-Safe API** - End-to-end type safety from server to client
- **Modern UI** - Premium design with Framer Motion animations

## 📦 Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React)
- **Routing**: [TanStack Router](https://tanstack.com/router) (File-based)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) (React Query v5)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **TypeScript**: Full type safety

## 🏗️ Architecture

This project follows **Clean Architecture** principles:

```
src/
├── domain/              # Business entities and repository interfaces
│   └── users/
│       ├── User.ts      # User entity
│       └── UserRepository.ts  # Repository interface
├── application/         # Use cases (business logic)
│   └── users/
│       ├── listUsers.ts
│       ├── getUser.ts
│       └── createUser.ts
├── infrastructure/      # External adapters
│   └── users/
│       ├── InMemoryUserRepository.ts  # Server-side repo
│       └── HttpUserRepository.ts      # Client-side repo
├── routes/              # API routes & UI pages
│   ├── __root.tsx       # Root layout with React Query provider
│   ├── index.tsx        # Landing page
│   ├── users.$id.tsx    # User detail page
│   └── api/
│       ├── users.ts     # GET/POST /api/users
│       └── users.$id.ts # GET /api/users/:id
└── components/          # React components
    ├── LandingPage.tsx
    └── common/
        ├── Navbar.tsx
        └── Footer.tsx
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** 20.19+ or 22.12+
- **Bun** (recommended) or npm

### Installation

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
bun run build
bun run serve
```

## 🔌 API Endpoints

### Users API

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| `GET`  | `/api/users`     | List all users    |
| `GET`  | `/api/users/:id` | Get user by ID    |
| `POST` | `/api/users`     | Create a new user |

**Example Request:**

```bash
# Get all users
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**Example Response:**

```json
[
  {
    "id": "1",
    "name": "Alice",
    "email": "alice@example.com"
  },
  {
    "id": "2",
    "name": "Bob",
    "email": "bob@example.com"
  }
]
```

## 🎨 Landing Page

The landing page includes:

- ✅ Hero section with gradient accent
- ✅ Feature cards with hover animations
- ✅ Product showcase section
- ✅ Customer testimonials
- ✅ Pricing tiers (Free, Pro, Business)
- ✅ Call-to-action section
- ✅ Modern navbar and footer

All sections are fully responsive and use Framer Motion for smooth animations.

## 🧪 Testing

```bash
bun run test
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Add your environment variables here
# DATABASE_URL=
# API_KEY=
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [TanStack](https://tanstack.com/) for the amazing tools
- [Tailwind Labs](https://tailwindcss.com/) for Tailwind CSS
- [Lucide](https://lucide.dev/) for beautiful icons
- [Framer](https://www.framer.com/) for Motion library

---

**Built with ❤️ using TanStack Start**

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/people',
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people');
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition='top-right' />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from '@tanstack/react-query';

import './App.css';

function App() {
  const { data } = useQuery({
    queryKey: ['people'],
    queryFn: () =>
      fetch('https://swapi.dev/api/people')
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
import './App.css';

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from '@tanstack/react-store';
import { Store, Derived } from '@tanstack/store';
import './App.css';

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
