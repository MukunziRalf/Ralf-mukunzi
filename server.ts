import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiApp from './src/api';
import * as Sentry from '@sentry/node';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Mount the API routes from our modular api module
  // Initialize Sentry for server-side error tracking if DSN provided
  if (process.env.SENTRY_DSN) {
    Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0 });
    app.use(Sentry.Handlers.requestHandler());
  }

  app.use(apiApp);

  // Vite Middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Dental Assistant Server running at http://localhost:${PORT}`);
  });
}

startServer();

// Sentry error handler should be added after the routes in production
if (process.env.SENTRY_DSN) {
  // Attach a simple uncaught exception handler to capture errors
  process.on('uncaughtException', (err) => {
    try {
      Sentry.captureException(err);
    } catch (e) {
      console.error('Error reporting to Sentry:', e);
    }
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });
}
