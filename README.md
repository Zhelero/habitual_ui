# Habitual UI

> React frontend for [Habitual API](https://github.com/Zhelero/habitual_api) — a habit tracking app with streak statistics and 30-day heatmap.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)

---

## Screenshots

![Login](./src/assets/screenshot-login.png)
![Dashboard](./src/assets/screenshot-dashboard.png)

---

## Features

- Login and registration with JWT authentication
- Auto-refresh of access token via refresh token rotation
- Dashboard with total habits, completed today, and best streak
- Full habit CRUD — create, edit, delete
- Mark habits as done / undo
- Current streak per habit
- 30-day heatmap per habit
- User data isolation — each user sees only their own habits

---

## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Framework  | React 18            |
| Build tool | Vite                |
| Styling    | Tailwind CSS        |
| Auth       | JWT (access + refresh tokens) |
| API client | fetch (native)      |
| State      | React Context + hooks |

---

## Project Structure

```
src/
├── components/
│   ├── LoginForm.jsx       # login / register form
│   └── RegisterForm.jsx
├── context/
│   └── AuthContext.jsx     # JWT storage and refresh logic
├── hooks/
│   └── useHabits.js        # data fetching and state
├── HabitualDashboard.jsx   # main dashboard view
├── api.js                  # API client with auth headers
└── App.jsx                 # routing between auth and dashboard
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Habitual API](https://github.com/Zhelero/habitual_api) running on `http://localhost:8000`

### Install and run

```bash
git clone https://github.com/Zhelero/habitual-ui
cd habitual-ui

npm install
npm run dev
```

UI will be available at `http://localhost:5173`

---

## Running the full stack

```bash
# Terminal 1 — API
cd habitual_api
uvicorn app.main:app --reload

# Terminal 2 — UI
cd habitual-ui
npm run dev
```

---

## Related

- [habitual_api](https://github.com/Zhelero/habitual_api) — FastAPI backend with PostgreSQL, JWT auth, and 98% test coverage
