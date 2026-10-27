# Career Engine Frontend

React and TypeScript frontend for Career Engine, built with Vite, Tailwind CSS, and daisyUI. Manage your profile, education, projects, companies, jobs, and tailored resumes, and share a public portfolio.

## Getting Started

Run from the `frontend` directory with Node.js and npm installed:

```bash
npm ci
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE` in `.env` to your backend URL (default: `http://localhost:8000`). Start the [backend](../backend/README.md) for sign-in and API features, then open the local URL printed by Vite. Set the backend's `FRONTEND_ORIGIN` to that URL.

## Scripts

- `npm run dev` — start the development server.
- `npm run build` — type-check and build for production.
- `npm run preview` — preview the production build locally.
- `npm run lint` — run ESLint.

See [API documentation](docs/API.md) for frontend integration details.
