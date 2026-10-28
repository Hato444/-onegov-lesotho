import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import authRoutes, { requireAuth } from './auth.js';
import apiRoutes from './routes.js';

const app = express();
app.disable('x-powered-by');
if (config.isProd) app.set('trust proxy', 1); // when running behind a reverse proxy

// Security headers (CSP, HSTS, no sniffing, no framing).
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: config.isProd ? [] : null,
      },
    },
  })
);

app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: 'draft-7', legacyHeaders: false }));

// Simple CSRF defence: changing requests must carry a custom header that other sites cannot send.
app.use('/api', (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('X-Requested-With') !== 'onegov') return res.status(403).json({ error: 'Request blocked.' });
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api', requireAuth, apiRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

// In production, serve the built React app from the same origin.
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.use((req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err, req, res, next) => {
  const client = err.status && err.status < 500;
  if (!client) console.error(err);
  res.status(client ? err.status : 500).json({ error: client ? 'Invalid request.' : 'Something went wrong on our side.' });
});

app.listen(config.port, () => console.log(`OneGov API listening on http://localhost:${config.port}`));
