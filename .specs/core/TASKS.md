# VerseCraft Task Breakdown

**Project:** VerseCraft
**Date:** 2026-01-02

Legend:
- `[P]` = Can run in parallel with adjacent [P] tasks
- `[D: X]` = Depends on task X completing first
- `[ ]` = Not started
- `[~]` = In progress
- `[x]` = Complete

---

## Phase 0: Setup

| ID | Task | Status |
|----|------|--------|
| 0.1 | Initialize Next.js 15 with TypeScript, Tailwind, App Router | [ ] |
| 0.2 | [P] Configure ESLint + Prettier | [ ] |
| 0.3 | [P] Set up pnpm workspace | [ ] |
| 0.4 | [D: 0.1] Install core dependencies (framer-motion, lucide-react) | [ ] |
| 0.5 | [D: 0.1] Configure path aliases (@/ imports) | [ ] |
| 0.6 | Create .env.example with required vars | [ ] |
| 0.7 | Initialize git repo, create .gitignore | [ ] |

---

## Phase 1: Foundation

### 1A: Database & Auth
| ID | Task | Status |
|----|------|--------|
| 1.1 | Create Supabase project | [ ] |
| 1.2 | [D: 1.1] Set up Drizzle with Supabase connection | [ ] |
| 1.3 | [D: 1.2] Create database schema (users, posts, likes, saves, follows, comments) | [ ] |
| 1.4 | [D: 1.3] Run initial migration | [ ] |
| 1.5 | [D: 1.1] Configure Supabase Auth (Google, GitHub, email) | [ ] |
| 1.6 | [D: 1.5] Create auth middleware for protected routes | [ ] |
| 1.7 | [D: 1.6] Build auth context/provider | [ ] |

### 1B: Design System
| ID | Task | Status |
|----|------|--------|
| 1.10 | [P] Set up Tailwind config with custom colors | [ ] |
| 1.11 | [P] Add custom fonts (Libre Baskerville, Inter) | [ ] |
| 1.12 | [P] Create CSS variables for design tokens | [ ] |
| 1.13 | [D: 1.10-12] Build base UI components (Button, Input, Avatar) | [ ] |
| 1.14 | [D: 1.13] Build Card component shell | [ ] |
| 1.15 | [D: 1.13] Build Layout component (header, main, nav) | [ ] |

---

## Phase 2: Animation Infrastructure

| ID | Task | Status |
|----|------|--------|
| 2.1 | Create motion config (variants, transitions) | [ ] |
| 2.2 | [P] Build AnimatedCard wrapper with scroll reveal | [ ] |
| 2.3 | [P] Build LikeAnimation component (heart burst) | [ ] |
| 2.4 | [P] Build SaveAnimation component (bookmark fill) | [ ] |
| 2.5 | Build page transition wrapper | [ ] |
| 2.6 | Set up reduced motion media query handling | [ ] |

---

## Phase 3: Feed & Content (US-001, US-002)

| ID | Task | Status |
|----|------|--------|
| 3.1 | Create posts API route (GET /api/feed) | [ ] |
| 3.2 | [D: 3.1] Build virtualized feed component | [ ] |
| 3.3 | [D: 3.2] Implement infinite scroll with cursor pagination | [ ] |
| 3.4 | [D: 1.14] Build PostCard component with typography | [ ] |
| 3.5 | [D: 3.4] Add expand/collapse for long content | [ ] |
| 3.6 | Build skeleton loader for cards | [ ] |
| 3.7 | [D: 3.3] Implement pull-to-refresh | [ ] |

---

## Phase 4: Auth Flow (US-003, US-004)

| ID | Task | Status |
|----|------|--------|
| 4.1 | Build login page UI | [ ] |
| 4.2 | Build signup page UI | [ ] |
| 4.3 | [D: 1.7] Wire up OAuth buttons (Google, GitHub) | [ ] |
| 4.4 | [D: 1.7] Wire up email/password form | [ ] |
| 4.5 | Build auth modal for anonymous users | [ ] |
| 4.6 | Create onboarding flow (username selection) | [ ] |
| 4.7 | Handle auth redirects and state persistence | [ ] |

---

## Phase 5: Interactions (US-005)

| ID | Task | Status |
|----|------|--------|
| 5.1 | Create like API route (POST /api/posts/[id]/like) | [ ] |
| 5.2 | Create save API route (POST /api/posts/[id]/save) | [ ] |
| 5.3 | [D: 5.1] Add like button to PostCard with optimistic update | [ ] |
| 5.4 | [D: 5.2] Add save button to PostCard with optimistic update | [ ] |
| 5.5 | [D: 2.3] Implement double-tap to like gesture | [ ] |
| 5.6 | Wire up like/save animations | [ ] |
| 5.7 | Add real-time like count updates (Supabase Realtime) | [ ] |

---

## Phase 6: Profiles (US-006, US-007)

| ID | Task | Status |
|----|------|--------|
| 6.1 | Create user profile API route (GET /api/users/[username]) | [ ] |
| 6.2 | Build profile page layout | [ ] |
| 6.3 | [D: 6.2] Build profile header (avatar, bio, stats) | [ ] |
| 6.4 | [D: 6.2] Build user's posts grid/list | [ ] |
| 6.5 | Build profile edit modal | [ ] |
| 6.6 | Implement avatar upload to Supabase Storage | [ ] |
| 6.7 | Create follow API route (POST /api/users/[username]/follow) | [ ] |
| 6.8 | [D: 6.7] Add follow button with optimistic update | [ ] |
| 6.9 | Build followers/following lists | [ ] |

---

## Phase 7: Post Creation (US-008)

| ID | Task | Status |
|----|------|--------|
| 7.1 | Create post API route (POST /api/posts) | [ ] |
| 7.2 | Build create post modal/page | [ ] |
| 7.3 | [D: 7.2] Build text editor with line break preservation | [ ] |
| 7.4 | [D: 7.3] Add live preview | [ ] |
| 7.5 | [D: 7.3] Add author/source fields | [ ] |
| 7.6 | [D: 7.3] Add post type selector (poetry, prose, quote) | [ ] |
| 7.7 | Implement content validation (min/max length) | [ ] |
| 7.8 | Wire up publish flow | [ ] |

---

## Phase 8: Comments (US-009)

| ID | Task | Status |
|----|------|--------|
| 8.1 | Create comments API routes (GET, POST) | [ ] |
| 8.2 | Build comments drawer/modal | [ ] |
| 8.3 | [D: 8.2] Build comment input | [ ] |
| 8.4 | [D: 8.2] Build comment thread (one level nesting) | [ ] |
| 8.5 | Add comment count to PostCard | [ ] |
| 8.6 | Implement delete own comment | [ ] |

---

## Phase 9: Seed Data

| ID | Task | Status |
|----|------|--------|
| 9.1 | Create seed data script structure | [ ] |
| 9.2 | [P] Curate 200+ poems from public domain | [ ] |
| 9.3 | [P] Curate 100+ prose passages | [ ] |
| 9.4 | [D: 9.2, 9.3] Format seed data as JSON | [ ] |
| 9.5 | [D: 9.4] Create seed script to populate database | [ ] |
| 9.6 | Run seed on Supabase | [ ] |

---

## Phase 10: PWA & Polish

| ID | Task | Status |
|----|------|--------|
| 10.1 | Configure next-pwa | [ ] |
| 10.2 | Create manifest.json | [ ] |
| 10.3 | Design and add app icons | [ ] |
| 10.4 | Implement service worker caching strategy | [ ] |
| 10.5 | Add offline fallback page | [ ] |
| 10.6 | Test PWA install flow | [ ] |
| 10.7 | Performance audit (Lighthouse) | [ ] |
| 10.8 | Accessibility audit | [ ] |
| 10.9 | Cross-browser testing | [ ] |
| 10.10 | Mobile responsive QA | [ ] |

---

## Phase 11: Launch Prep

| ID | Task | Status |
|----|------|--------|
| 11.1 | Set up production Supabase | [ ] |
| 11.2 | Configure Vercel project | [ ] |
| 11.3 | Set up environment variables | [ ] |
| 11.4 | Configure custom domain (if any) | [ ] |
| 11.5 | Set up Sentry error tracking | [ ] |
| 11.6 | Create OG images for social sharing | [ ] |
| 11.7 | Final production deploy | [ ] |

---

## Milestone Summary

| Milestone | Phases | Deliverable |
|-----------|--------|-------------|
| M1: Scrollable Feed | 0-3 | Anonymous users can browse infinite feed |
| M2: Auth & Save | 4-5 | Users can sign up, like, save |
| M3: Social | 6-8 | Profiles, follows, posts, comments |
| M4: Content | 9 | 500+ seeded literary works |
| M5: Production | 10-11 | PWA deployed to production |

---

## Time Blocks (Suggested)

This is a rough ordering, not time estimates:

1. **Setup + Foundation** (Phases 0-2)
2. **Core Feed** (Phase 3)
3. **Auth** (Phase 4)
4. **Interactions** (Phase 5)
5. **Social Features** (Phases 6-8)
6. **Content + Polish** (Phases 9-11)

---

## Next Action

Start with **Phase 0: Setup** - Initialize the Next.js project.
