# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Badminton HSK — a fullstack badminton party/game management app. Users create parties (sessions), invite players, manage games with team assignments and scoring, and track shuttlecock usage. Thai-localized (Asia/Bangkok timezone, Prompt font).

## Tech Stack

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** Vue 3 + Inertia.js (server-rendered SPA)
- **Build:** Vite 5 with `@tailwindcss/vite`
- **Styling:** Tailwind CSS 4.2 + DaisyUI 5.5 + SCSS
- **State:** Pinia
- **Testing:** Pest 3.0
- **Auth:** Laravel Breeze + Socialite (LINE, Google, Apple) + LINE LIFF
- **Real-time:** Pusher/Laravel Reverb/Ably broadcasting
- **DB:** MySQL (database name: `badmintonparty`)

## Common Commands

```bash
# Development
npm run dev              # Vite dev server
php artisan serve        # Laravel dev server

# Build
npm run build            # Vite build + SSR build

# Tests
./vendor/bin/pest                          # Run all tests
./vendor/bin/pest tests/Feature/GameTest.php  # Run single test file
./vendor/bin/pest --filter="test name"     # Run specific test

# Database
php artisan migrate          # Run migrations
php artisan migrate:fresh --seed  # Reset & seed
php artisan db:seed          # Run seeders

# Dependencies
composer install && npm install
```

## Architecture

### Request Flow

Laravel routes (Inertia) → Controller → `Inertia::render('PageName', $props)` → Vue page component receives props.

Routes are in `routes/web.php` (main) and `routes/auth.php` (Breeze auth). The root `/` redirects to `/party-lists`.

### Layout System

Two layout systems coexist:
- **`resources/js/Layouts/`** — Breeze-generated layouts (`AuthenticatedLayout`, `GuestLayout`)
- **`resources/js/layout/`** — Custom badminton layouts (`BadmintonLayout.vue` is the primary layout, with `BadmintonTopbar.vue` and `BadmintonBottomNav.vue` for mobile)

Layout composable: `resources/js/layout/composables/badmintonLayout.js` — manages theme switching via `data-theme` attribute and `dark` class on `<html>`.

### Key Directories

- `app/Http/Controllers/` — `PartyController`, `GameController`, `PartyMemberController`, `ChatController`, `LineMessagingController`
- `app/Models/` — Core models: `Party`, `PartyMember`, `Game`, `GamePlayer`, `GameSet`, `GameShuttlecock`, `User`, `Court`
- `resources/js/Pages/` — Vue page components (routed via Inertia)
- `resources/js/Components/` — Reusable Vue components (`UserAvatar`, `DaisyToast`, `DaisyConfirmDialog`, `LayoutSwitcher`)
- `resources/js/composables/` — `useToast.js`, `useConfirm.js`, `useDragDrop.js`
- `resources/js/stores/` — Pinia stores (`liffStore.js` for LINE LIFF)

### Domain Model

**Party** → has many **PartyMembers** (users with role/status/display_name) → has many **Games** → each Game has **GamePlayers** (with team assignment), **GameSets** (scoring rounds), and **GameShuttlecocks** (inventory tracking). Parties are linked to **Courts** via **PartyCourtBookings**.

### Styling & Theming

CSS config is in `resources/css/app.css` using Tailwind v4 syntax:
- `@plugin "daisyui"` for DaisyUI with `themes: all`
- `@plugin "daisyui/theme"` for custom themes: `badminton` (light, default) and `badminton-dark` (dark green, prefersdark)
- `@theme { ... }` for custom Tailwind tokens (court colors, shuttle yellow, animations)
- `@custom-variant dark (&:is(.dark *))` for class-based dark mode
- No `tailwind.config.js` or `postcss.config.js` — all config is CSS-based

**Important:** All components must use DaisyUI semantic color classes (`bg-primary`, `text-base-content`, `bg-error/10`, etc.) instead of hardcoded Tailwind colors (`bg-blue-500`, `text-red-600`). This ensures colors adapt correctly when users switch themes. Use `UserAvatar` component (not raw `<img>`) for all avatar rendering — it provides fallback initials when images are unavailable.

Additional theme CSS is in `resources/css/badminton-theme.css` (transitions, card effects, shimmer, scrollbar) — these also use CSS variables (`var(--color-primary)`) for theme awareness.

### CSS Import Order (in app.js)

1. `paper-css/paper.min.css` — loaded first so our styles override it
2. `resources/css/app.css` — Tailwind + DaisyUI + themes
3. `resources/assets/styles.scss` — Legacy PrimeVue layout SCSS + root CSS variables
4. `resources/css/custom.css` — Custom animations
5. `resources/css/badminton-theme.css` — Theme-aware component styles

### Inertia Shared Data

`HandleInertiaRequests` middleware shares auth user data and Ziggy routes to all pages. `CheckUserSetup` middleware ensures user profile is complete before accessing party features.

### Testing

Tests use SQLite in-memory (configured in `phpunit.xml`). Factories exist for `User`, `Court`, `Party`, `Game`. Feature tests cover game lifecycle, party management, player management, and user setup flows.
