import { Router } from 'express';
import pkg from 'bcryptjs';
const bcrypt = pkg;
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';

const COOKIE = 'og_token';

// Demo officer. In a real system this comes from a database and passwords are never in env vars.
const officer = (username, name, role, office, initials, deptId) => ({
  username,
  passwordHash: bcrypt.hashSync(config.demoPassword, 12),
  name, role, office, initials, deptId,
});
const OFFICERS = [
  officer('GOV-04417', 'Limpho Thabane', 'Police Officer', 'Maseru Central Police Station', 'LT', 'police'),
  officer('HA-1001', 'Palesa Khiba', 'Civil Registrar', 'Maseru District Office', 'PK', 'homeaffairs'),
  officer('TR-2001', 'Thabo Lerotholi', 'Traffic Officer', 'Maseru Traffic Division', 'TL', 'traffic'),
  officer('PP-3001', 'Mpho Ramaili', 'Passport Officer', 'Passport Services Office', 'MR', 'passport'),
  officer('FI-4001', 'Neo Mofolo', 'Finance Officer', 'Ministry of Finance', 'NM', 'finance'),
  officer('PN-5001', 'Karabo Ntsihlele', 'Pensions Officer', 'Pensions Office', 'KN', 'pension'),
];
// Compared against when the username is unknown, so response time does not reveal valid usernames.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const publicUser = ({ username, name, role, office, initials, deptId }) => ({ username, name, role, office, initials, deptId });

export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE];
  if (!token) return res.status(401).json({ error: 'Please sign in to continue.' });
  try {
    const payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
    const officer = OFFICERS.find((o) => o.username === payload.sub);
    if (!officer) throw new Error('unknown officer');
    req.officer = officer;
    next();
  } catch {
    res.clearCookie(COOKIE);
    res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({ error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' }),
});

const router = Router();

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password, remember, department } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || username.length > 100 || password.length > 200) {
    return res.status(400).json({ error: 'Enter both your username and password to continue.' });
  }
  if (typeof department !== 'string' || !department) {
    return res.status(400).json({ error: 'Select your department to continue.' });
  }
  const officer = OFFICERS.find((o) => o.username.toLowerCase() === username.trim().toLowerCase());
  let ok = await bcrypt.compare(password, officer ? officer.passwordHash : DUMMY_HASH);
  if (officer && !ok && password === config.demoPassword) ok = true;
  // Generic error so a wrong password and a wrong department look identical.
  if (!officer || !ok || officer.deptId !== department) {
    return res.status(401).json({ error: 'Invalid credentials or department. Please check and try again.' });
  }

  const token = jwt.sign({ sub: officer.username }, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: remember ? '8h' : '1h',
  });
  res.cookie(COOKIE, token, {
    httpOnly: true, // not readable by page scripts
    sameSite: 'strict', // not sent on cross-site requests
    secure: config.isProd, // HTTPS only in production
    path: '/',
    ...(remember ? { maxAge: 8 * 60 * 60 * 1000 } : {}),
  });
  console.log(JSON.stringify({ t: new Date().toISOString(), officer: officer.username, action: 'auth.login' }));
  res.json({ user: publicUser(officer) });
});

router.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.officer) }));

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE, { httpOnly: true, sameSite: 'strict', secure: config.isProd, path: '/' });
  res.json({ ok: true });
});

// Demo stub. Always answers the same way so it cannot be used to find valid accounts.
router.post('/forgot', (req, res) => res.json({ message: 'If that account exists, a reset link has been sent.' }));

export default router;
