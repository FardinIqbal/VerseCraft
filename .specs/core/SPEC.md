# VerseCraft Specification

**Project:** VerseCraft - Literature Doom-Scroll Platform
**Version:** 1.0
**Date:** 2026-01-02

---

## Vision

Instagram for literature. A visually minimal, modern platform where users doom-scroll through poetry and short literary passages. Clean aesthetic inspired by the timelessness of literature itself.

---

## User Stories

### P1 - MVP (Must Have)

#### US-001: Infinite Feed
**As a** reader
**I want** an endless vertical feed of literature
**So that** I can discover poetry and passages through passive consumption

**Acceptance Criteria:**
- Given I open the app, when the page loads, then I see a vertical feed of literary content
- Given I scroll to the bottom, when more content exists, then new posts load seamlessly
- Given I'm on slow connection, when scrolling, then skeleton loaders appear
- Given reduced motion preference, when scrolling, then animations are minimal

#### US-002: Content Cards
**As a** reader
**I want** beautifully formatted text cards
**So that** each piece feels like a standalone moment

**Acceptance Criteria:**
- Given a poem, when displayed, then line breaks and stanzas are preserved
- Given a passage, when displayed, then it shows with proper quotation styling
- Given any content, when displayed, then author and source are visible
- Given long content, when displayed, then it expands on tap/click

#### US-003: Anonymous Browsing
**As a** visitor
**I want** to browse without signing up
**So that** I can explore before committing

**Acceptance Criteria:**
- Given I'm not logged in, when I open the app, then I see the full feed
- Given I'm not logged in, when I try to like/save, then I see a signup prompt
- Given I sign up, when I return, then my feed position is preserved

#### US-004: User Authentication
**As a** user
**I want** to create an account
**So that** I can save favorites and post content

**Acceptance Criteria:**
- Given I want to sign up, when I click sign up, then I see email/OAuth options
- Given I have an account, when I sign in, then I access my saved content
- Given I'm signed in, when I refresh, then I remain authenticated

#### US-005: Like & Save
**As a** reader
**I want** to like and save posts
**So that** I can revisit my favorites

**Acceptance Criteria:**
- Given I'm logged in, when I double-tap a card, then it's liked with animation
- Given I'm logged in, when I tap the bookmark icon, then it's saved to my collection
- Given I've saved content, when I visit my profile, then I see my saved items

---

### P2 - Social Core (Should Have)

#### US-006: User Profiles
**As a** user
**I want** a profile page
**So that** others can see my posts and taste

**Acceptance Criteria:**
- Given I have a profile, when someone visits it, then they see my bio and posts
- Given I'm viewing my profile, when I tap edit, then I can update bio/avatar
- Given I'm viewing another profile, when I tap follow, then I follow them

#### US-007: Follow System
**As a** user
**I want** to follow other users
**So that** I see their content in my feed

**Acceptance Criteria:**
- Given I follow someone, when they post, then it appears in my feed
- Given I'm logged in, when I view someone's profile, then I see follow/following state
- Given I follow someone, when I view followers, then accurate counts show

#### US-008: Post Creation
**As a** user
**I want** to post poetry or passages
**So that** I can share literature I love

**Acceptance Criteria:**
- Given I'm logged in, when I tap create, then I see a clean text editor
- Given I'm posting, when I enter text, then I can preview formatting
- Given I'm posting, when I add author/source, then it's attributed properly
- Given I post, when it publishes, then it appears in followers' feeds

#### US-009: Comments
**As a** user
**I want** to comment on posts
**So that** I can discuss literature with others

**Acceptance Criteria:**
- Given I'm viewing a post, when I tap comments, then I see the comment thread
- Given I'm logged in, when I write a comment, then it posts to the thread
- Given comments exist, when I view them, then they're threaded properly

---

### P3 - Enhancement (Nice to Have)

#### US-010: Search & Discover
**As a** reader
**I want** to search for authors, works, or themes
**So that** I can find specific literature

#### US-011: Collections
**As a** user
**I want** to organize saves into collections
**So that** I can curate themed lists

#### US-012: Share
**As a** user
**I want** to share posts externally
**So that** I can spread beautiful literature

#### US-013: Reading Lists
**As a** reader
**I want** curated reading lists
**So that** I can explore themed content

#### US-014: Audio Mode
**As a** reader
**I want** text-to-speech for posts
**So that** I can listen to poetry

---

## Functional Requirements

### Content System
| ID | Requirement |
|----|-------------|
| FR-001 | Posts contain: text, author, source (optional), user_id, created_at |
| FR-002 | Text supports line breaks, stanzas, and basic formatting |
| FR-003 | Posts are categorized: poetry, prose, quote |
| FR-004 | Seed database includes 500+ public domain works |
| FR-005 | Content moderation flags non-literary content |

### Feed System
| ID | Requirement |
|----|-------------|
| FR-010 | Feed uses infinite scroll with virtualization |
| FR-011 | Feed algorithm balances: following, popular, fresh |
| FR-012 | Anonymous feed shows curated/popular content |
| FR-013 | Authenticated feed prioritizes followed users |
| FR-014 | Feed loads 10 posts per batch |

### User System
| ID | Requirement |
|----|-------------|
| FR-020 | Users have: username, display_name, bio, avatar |
| FR-021 | Usernames are unique, 3-20 chars, alphanumeric + underscores |
| FR-022 | OAuth supported: Google, GitHub |
| FR-023 | Email/password auth with verification |
| FR-024 | Sessions persist for 30 days |

### Social System
| ID | Requirement |
|----|-------------|
| FR-030 | Likes are togglable, counts update in real-time |
| FR-031 | Saves are private to the user |
| FR-032 | Follows create bidirectional relationship tracking |
| FR-033 | Comments are threaded one level deep |
| FR-034 | Users can delete their own comments |

### Performance
| ID | Requirement |
|----|-------------|
| FR-040 | Initial load < 2s on 3G |
| FR-041 | Feed scroll maintains 60fps |
| FR-042 | Images lazy load with blur placeholder |
| FR-043 | PWA works offline with cached content |

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Accessibility | WCAG 2.1 AA compliance |
| Accessibility | Screen reader compatible |
| Accessibility | Respects prefers-reduced-motion |
| Security | Input sanitization (XSS prevention) |
| Security | Rate limiting on auth endpoints |
| Security | HTTPS only |
| Privacy | Minimal data collection |
| Privacy | GDPR-compliant data export/delete |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to First Content | < 1.5s |
| Scroll Performance | 60fps consistent |
| Session Duration | > 3 minutes average |
| Return Rate | > 40% within 7 days |
| Posts per Active User | > 2 per month |

---

## Out of Scope (v1)

- Direct messaging
- Stories/ephemeral content
- Monetization
- Mobile native apps
- Multi-language support
- Advanced analytics dashboard
