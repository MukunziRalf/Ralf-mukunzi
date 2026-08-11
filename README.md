# DentalCare AI Assistant

This repository contains a React + Express app with a small server to host API endpoints and a Vite-built frontend.

Quick start (local)

1. Install dependencies:

```bash
npm install
```

2. Set required environment variables (locally):

```bash
export GEMINI_API_KEY="your_gemini_api_key"
# Optional for error reporting
export SENTRY_DSN="your_sentry_dsn"
```

3. Run in development:

```bash
npm run dev
# Open http://localhost:3000
```

Build (production)

```bash
npm run build
npm start
# Server listens on process.env.PORT || 3000
```

Deploying to Render

1. Create a Render "Web Service" and connect the GitHub repo.
2. Set the Build command to: `npm install && npm run build`
3. Set the Start command to: `npm start`
4. Add environment variables in the Render dashboard:
   - `GEMINI_API_KEY` (required)
   - `SENTRY_DSN` (optional)
5. Deploy and verify `/health` responds with 200.

Notes
- Do NOT commit secrets to the repository. Use host environment variables.
- If deployment fails with missing `dist/server.cjs`, ensure the build step ran before start.

Support

If you want, I can also help add a custom domain, set up uptime monitoring, or configure Sentry fully.
