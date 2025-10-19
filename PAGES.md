# Pages Documentation

## Overview

This document describes all the pages created in the Cogmatt application following Clean Architecture principles.

## Page Structure

### 1. Home Page (`/`)

**File:** `src/routes/index.tsx`
**Component:** `LandingPage.tsx`

**Sections:**

- Hero Section - Main call-to-action with animated gradient text
- Features Grid - 3 key features with icons
- Product Showcase - Visual demonstration
- Testimonials - 3 customer testimonials
- Stats Section - Key metrics (50K+ users, 99.9% uptime, etc.)
- Social Proof - Company logos
- How It Works - 3-step process
- Comparison Table - Cogmatt vs Traditional Tools
- FAQ Section - 6 common questions
- Pricing Preview - 3 pricing tiers
- Final CTA - Call-to-action with gradient background

**Features:**

- Dark mode support
- Framer Motion animations
- Responsive design
- Gradient effects
- Smooth scroll animations

---

### 2. Features Page (`/features`)

**File:** `src/routes/features.tsx`

**Sections:**

- Hero Section - "Powerful Features for Modern Teams"
- Features Grid - 12 feature cards:
  1. Lightning Fast Performance
  2. Enterprise-Grade Security
  3. AI-Powered Automation
  4. Real-Time Collaboration
  5. 500+ Integrations
  6. Advanced Analytics
  7. Granular Permissions
  8. Smart Workflows
  9. 99.9% Uptime SLA
  10. Mobile-First Design
  11. Version Control
  12. 24/7 Priority Support
- Integration Showcase - 12 popular integrations
- CTA Section - Free trial call-to-action

**Features:**

- Color-coded feature icons with gradients
- Hover animations on cards
- Integration grid with scale effects
- Full dark mode support

---

### 3. Pricing Page (`/pricing`)

**File:** `src/routes/pricing.tsx`

**Sections:**

- Hero Section - "Simple, Transparent Pricing"
- Billing Toggle - Monthly/Annual switch (with 20% save badge)
- Pricing Cards - 3 tiers:
  - **Starter** - $0/month (5 projects, 10GB storage)
  - **Pro** - $29/month (Unlimited projects, 100GB storage) ⭐ Most Popular
  - **Enterprise** - $99/month (Unlimited everything)
- Comparison Table - Feature comparison across all plans
- FAQ Section - 6 pricing-related questions
- CTA Section - "Start Your Free Trial Today"

**Features:**

- Check/X icons for feature availability
- Highlighted "Most Popular" plan
- Responsive table design
- Gradient CTA section
- Dark mode optimized

---

### 4. Login Page (`/login`)

**File:** `src/routes/login.tsx`

**Layout:**

- **Left Side (Form):**
  - Logo and branding
  - Social login buttons (Google, GitHub)
  - Email/password form
  - "Remember me" checkbox
  - "Forgot password?" link
  - Sign up link

- **Right Side (Hero):**
  - Gradient background
  - "Join 50,000+ users" heading
  - Stats display (99.9% Uptime, 50K+ Users, 4.9/5 Rating)
  - Testimonial card with user info

**Features:**

- Split-screen design (form + hero)
- Social authentication buttons
- Loading state on submit
- Form validation (required fields)
- Smooth animations
- Responsive (mobile shows form only)
- Dark mode support

---

## Architecture

All pages follow Clean Architecture principles:

```
src/
├── routes/              # Route components (Presentation Layer)
│   ├── index.tsx       # Home page
│   ├── features.tsx    # Features page
│   ├── pricing.tsx     # Pricing page
│   └── login.tsx       # Login page
├── components/          # Reusable components
│   ├── LandingPage.tsx # Landing page component
│   └── common/
│       ├── Navbar.tsx  # Navigation with dark mode toggle
│       └── Footer.tsx  # Footer component
├── lib/                # Utilities
│   └── theme-provider.tsx  # Dark mode context
└── domain/             # Domain layer (business logic)
    └── users/          # User entity & repository
```

## Navigation

The Navbar component (`src/components/common/Navbar.tsx`) provides navigation to all pages:

- Home (`/`)
- Features (`/features`)
- Pricing (`/pricing`)
- Login (`/login`)

Plus:

- Dark mode toggle (Moon/Sun icon)
- "Get Started" CTA button
- Responsive mobile menu

## Dark Mode

All pages support dark mode via the `ThemeProvider`:

- System preference detection
- Manual toggle via Navbar
- LocalStorage persistence
- SSR-safe implementation

## Styling

**Technology:**

- Tailwind CSS v4.0.6
- Custom gradients (indigo-600 to blue-500)
- Dark mode classes (dark:\*)
- Responsive breakpoints (md:, lg:)

**Color Scheme:**

- Light: slate-50 to white backgrounds
- Dark: slate-950 to slate-900 backgrounds
- Accent: indigo-600 to blue-500 gradient
- Text: slate-600 (light), slate-400 (dark)

## Animations

**Library:** Framer Motion v12.23.24

**Animation Types:**

- Fade in on mount
- Slide up on scroll (whileInView)
- Scale on hover
- Tap feedback (whileTap)
- Stagger animations on lists

## Icons

**Library:** Lucide React v0.545.0

**Common Icons:**

- Sparkles (logo)
- Zap (speed/performance)
- Shield (security)
- Users (collaboration)
- Check/X (feature availability)
- Moon/Sun (theme toggle)
- Mail, Lock (login form)
- Chrome, Github (social login)

## Next Steps

To add authentication functionality:

1. Create auth domain layer (`src/domain/auth/`)
2. Add auth repository interface
3. Implement auth use cases (login, register, logout)
4. Connect login form to auth use cases
5. Add protected routes
6. Implement session management

## Running the App

```bash
bun run dev
```

Visit:

- http://localhost:3000/ - Home
- http://localhost:3000/features - Features
- http://localhost:3000/pricing - Pricing
- http://localhost:3000/login - Login
