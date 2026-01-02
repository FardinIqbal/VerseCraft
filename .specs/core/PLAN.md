# VerseCraft Technical Plan

**Project:** VerseCraft
**Date:** 2026-01-02

---

## Tech Stack

### Core Framework
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router) | SSR, RSC, your stack |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Animation | Framer Motion | React-native, gesture support |
| Icons | Lucide React | Clean, consistent |

### Backend & Data
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Database | Supabase (Postgres) | Real-time, auth built-in, generous free tier |
| ORM | Drizzle | Type-safe, lightweight, your preference |
| Auth | Supabase Auth | OAuth + email, session management |
| Storage | Supabase Storage | Avatar uploads |
| Real-time | Supabase Realtime | Like counts, new posts |

### Infrastructure
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Hosting | Vercel | Next.js native, edge functions |
| CDN | Vercel Edge | Global distribution |
| Analytics | Vercel Analytics | Simple, privacy-focused |
| Error Tracking | Sentry | Production debugging |

### Development
| Tool | Purpose |
|------|---------|
| pnpm | Package manager (fast) |
| ESLint | Linting |
| Prettier | Formatting |
| Vitest | Unit testing |
| Playwright | E2E testing |

---

## Architecture

### Project Structure

```
versecraft/
├── .specs/                 # Specifications
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Auth routes (login, signup)
│   │   ├── (main)/        # Main app routes
│   │   │   ├── page.tsx   # Feed
│   │   │   ├── [username]/# Profile
│   │   │   └── post/[id]/ # Single post
│   │   ├── api/           # API routes
│   │   └── layout.tsx     # Root layout
│   ├── components/
│   │   ├── ui/            # Base components
│   │   ├── feed/          # Feed components
│   │   ├── post/          # Post components
│   │   └── profile/       # Profile components
│   ├── lib/
│   │   ├── supabase/      # Supabase client
│   │   ├── db/            # Drizzle schema + queries
│   │   └── utils/         # Helpers
│   ├── hooks/             # Custom hooks
│   └── styles/            # Global styles
├── public/
├── drizzle/               # Migrations
└── tests/
```

### Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │     │    posts    │     │   comments  │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (uuid)   │←────│ user_id     │     │ id          │
│ username    │     │ id (uuid)   │←────│ post_id     │
│ display_name│     │ content     │     │ user_id     │
│ bio         │     │ author      │     │ content     │
│ avatar_url  │     │ source      │     │ parent_id   │
│ created_at  │     │ type        │     │ created_at  │
└─────────────┘     │ created_at  │     └─────────────┘
       │            └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  follows    │     │    likes    │
├─────────────┤     ├─────────────┤
│ follower_id │     │ user_id     │
│ following_id│     │ post_id     │
│ created_at  │     │ created_at  │
└─────────────┘     └─────────────┘

┌─────────────┐
│    saves    │
├─────────────┤
│ user_id     │
│ post_id     │
│ created_at  │
└─────────────┘
```

---

## Design System

### Philosophy
Typography-first. Literature is the hero. UI disappears.

### Color Tokens (Dark Mode Primary)

```css
:root {
  /* Background */
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --bg-tertiary: #1a1a1a;
  --bg-card: #0f0f0f;

  /* Text */
  --text-primary: #fafafa;
  --text-secondary: #a1a1a1;
  --text-muted: #525252;

  /* Accent */
  --accent: #e5e5e5;
  --accent-hover: #ffffff;

  /* Borders */
  --border: #262626;
  --border-hover: #404040;
}
```

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Poetry/Prose | Libre Baskerville | 18-22px | 400 |
| Author | Inter | 14px | 500 |
| UI Text | Inter | 14-16px | 400-500 |
| Headings | Inter | 24-32px | 600 |

### Spacing Scale

```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

### Card Design

```
┌────────────────────────────────┐
│                                │
│   "The woods are lovely,       │
│    dark and deep,              │
│    But I have promises         │
│    to keep..."                 │
│                                │
│   ─────────────────────        │
│   Robert Frost                 │
│   Stopping by Woods...         │
│                                │
│   ♡ 234    💬 12    ⋮          │
└────────────────────────────────┘
```

---

## Animation Specification

### Motion Philosophy
**Subtle, literary, intentional.** Like turning pages. No flashy transitions - elegance through restraint.

### Motion Tokens

```css
:root {
  --duration-micro: 150ms;    /* Hover, focus */
  --duration-normal: 300ms;   /* UI transitions */
  --duration-page: 500ms;     /* Page transitions */

  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Key Animations

| Interaction | Animation |
|-------------|-----------|
| Card enter (scroll) | Fade up 20px, opacity 0→1, staggered 50ms |
| Like tap | Scale 1→1.2→1, heart fill animation |
| Save tap | Bookmark slides down, fills |
| Double-tap like | Heart burst from center |
| Card expand | Height auto-animate, content fade |
| Page transition | Crossfade 300ms |
| Pull refresh | Rotate icon, spring bounce |

### Scroll Behavior
- Smooth scroll snap (optional)
- Virtualized list (react-window or @tanstack/virtual)
- Skeleton loaders with shimmer
- Intersection Observer for analytics

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## API Design

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/feed | Paginated feed |
| GET | /api/posts/[id] | Single post |
| POST | /api/posts | Create post |
| DELETE | /api/posts/[id] | Delete post |
| POST | /api/posts/[id]/like | Toggle like |
| POST | /api/posts/[id]/save | Toggle save |
| GET | /api/posts/[id]/comments | Get comments |
| POST | /api/posts/[id]/comments | Add comment |
| GET | /api/users/[username] | User profile |
| POST | /api/users/[username]/follow | Toggle follow |
| GET | /api/search | Search posts/users |

### Feed Algorithm (v1 Simple)

```typescript
// Anonymous: popular + recent
// Authenticated: 60% following, 30% popular, 10% fresh

const getFeed = async (userId?: string, cursor?: string) => {
  if (!userId) {
    return getPopularFeed(cursor);
  }

  const [following, popular, fresh] = await Promise.all([
    getFollowingPosts(userId, 6),
    getPopularPosts(3),
    getFreshPosts(1),
  ]);

  return shuffle([...following, ...popular, ...fresh]);
};
```

---

## Security Considerations

| Risk | Mitigation |
|------|------------|
| XSS | DOMPurify on user content |
| SQL Injection | Drizzle parameterized queries |
| CSRF | Supabase handles tokens |
| Rate Limiting | Vercel Edge middleware |
| Spam | Honeypot + rate limits on posts |

---

## PWA Configuration

```json
{
  "name": "VerseCraft",
  "short_name": "VerseCraft",
  "theme_color": "#0a0a0a",
  "background_color": "#0a0a0a",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

- Service worker for offline cached content
- Background sync for likes/saves
- Push notifications (P3)

---

## Seed Data Strategy

### Sources (Public Domain)
- Project Gutenberg poetry collections
- Poetry Foundation (public domain)
- Classic prose excerpts

### Initial Seed
- 500+ poems (curated for quality)
- 200+ prose passages
- Tagged by: author, era, theme, mood

### Format
```json
{
  "content": "poem text...",
  "author": "Emily Dickinson",
  "source": "Hope is the thing with feathers",
  "type": "poetry",
  "tags": ["hope", "nature", "19th-century"]
}
```
