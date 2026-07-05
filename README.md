> React frontend for [Habitual API](https://github.com/Zhelero/habitual_api) — a habit tracking app with streak statistics and 30-day heatmap.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter)
![Tests](https://img.shields.io/badge/e2e_tests-21%20passed-brightgreen?style=flat-square&logo=playwright)
![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=flat-square&logo=eslint)
![CI](https://github.com/Zhelero/habitual_ui/actions/workflows/ci.yml/badge.svg)

---

## Screenshots

![Login](./src/assets/screenshot-login.png)
![Dashboard](./src/assets/screenshot-dashboard.png)
![Habit](./src/assets/screenshot-habit-page.png)

---

## Features

- Login and registration with JWT authentication, with password confirmation on sign-up
- Auto-refresh of access token via refresh token rotation
- Dashboard with total habits, completed today, and best streak
- Habit CRUD — create, edit, archive / restore (no hard delete)
- Custom color per habit, shown on the dashboard and detail page
- 7-day activity strip on each dashboard habit card
- Filter habits by Active / Archived / All, with a dedicated empty state per filter
- Sort by pending, completed, streak, or alphabetically
- Mark habits as done / undo
- Dedicated habit detail page (`/habits/:id`) with full stats and a full-size 30-day heatmap
- Persisted dark mode, applied consistently across every route
- Filter and sort selection persisted in the URL (shareable, survives refresh, cleared on logout)
- Auto-dismissing success messages
- End-to-end test suite (Playwright) covering auth, habit CRUD, detail page, and color selection
- CI pipeline (GitHub Actions): lint, then E2E tests run against a real backend + PostgreSQL, checked out and started inside the same workflow

---

## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Framework  | React 18            |
| Routing    | React Router 7      |
| Build tool | Vite                |
| Styling    | Tailwind CSS        |
| Auth       | JWT (access + refresh tokens) |
| API client | fetch (native)      |
| State      | React Context + hooks |
| E2E testing | Playwright         |
| Linting    | ESLint 9 (flat config) |

---

## Routes

| Route          | Description                                              |
|----------------|-----------------------------------------------------------|
| `/`            | Dashboard — habit list, filters, sorting                  |
| `/habits/:id`  | Habit detail — streak/completion stats, heatmap, edit, archive |

Unauthenticated visitors are shown the login/register screen regardless of route.

---

## Project Structure
src/

├── components/

│   ├── HabitCard.jsx        # habit row on the dashboard list

│   ├── HabitForm.jsx        # create / edit form

│   ├── Heatmap.jsx          # 30-day activity heatmap

│   ├── ThemeToggle.jsx      # dark mode switch

│   ├── LoginForm.jsx        # login form

│   └── RegisterForm.jsx     # registration form

├── context/

│   ├── AuthContext.jsx      # AuthProvider component (login/logout, token state)

│   └── authContextObject.js # raw React context object (kept separate for Fast Refresh)

├── hooks/

│   ├── useAuth.js           # useAuth hook (reads AuthContext)

│   ├── useHabits.js         # list + stats fetching for the dashboard

│   └── useHabit.js          # single habit + stats + heatmap for the detail page

├── utils/

│   ├── sortHabits.js

│   └── habitColors.js       # HABIT_COLORS palette + habitColorClass helper

├── AuthPage.jsx              # login / register screen

├── HabitualDashboard.jsx      # dashboard: list, filters, sorting

├── HabitDetailPage.jsx        # /habits/:id — full stats, heatmap, edit/archive

├── api.js                     # API client with auth headers

├── App.jsx                    # route definitions + dark mode state

└── main.jsx                   # React Router + AuthProvider setup

e2e/                          # Playwright end-to-end tests

├── auth.spec.js               # login / registration / token refresh

├── habits.spec.js             # habit CRUD, filters, sorting

├── habit-detail.spec.js       # detail page stats, edit, archive

├── habit-color.spec.js        # color picker and color persistence

├── fixtures.js                 # authedPage / registeredUser fixtures

├── helpers.js                  # shared test helpers (createHabitViaUI, uniqueEmail)

└── global-setup.js             # test environment bootstrap

.github/workflows/

└── ci.yml                       # lint job + e2e job (checks out habitual_api, runs it in Docker, then Playwright)

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Habitual API](https://github.com/Zhelero/habitual_api) running on `http://localhost:8000`

### Install and run

```bash
git clone https://github.com/Zhelero/habitual_ui
cd habitual_ui

npm install
npm run dev
```

UI will be available at `http://localhost:5173`

---

## Running E2E tests

```bash
npx playwright install   # first time only
npm run test:e2e
```

Tests run against a live API on `http://localhost:8000`, so make sure the backend is up first. Each test registers its own user, so runs are isolated from each other.

---

## CI

On every push/PR, GitHub Actions runs two jobs:

1. **lint** — ESLint against the whole codebase
2. **e2e** — checks out [habitual_api](https://github.com/Zhelero/habitual_api) into the same job, starts it with Docker (Postgres + FastAPI, migrations included), waits for `/health`, then runs the full Playwright suite against that live backend. The Playwright HTML report is uploaded as a build artifact either way, so a failing run can be inspected without reproducing it locally.

The two repos stay separate, but tests always run against the real API, not a mock.

---

## Running the full stack

```bash
# Terminal 1 — API
cd habitual_api
uvicorn app.main:app --reload

# Terminal 2 — UI
cd habitual_ui
npm run dev
```

---

## Related

- [habitual_api](https://github.com/Zhelero/habitual_api) — FastAPI backend with PostgreSQL, JWT auth, and 98% test coverage