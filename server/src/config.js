import crypto from 'node:crypto';

const isProd = process.env.NODE_ENV === 'production';

function required(name, devFallback) {
  const value = process.env[name];
  if (value) return value;
  if (isProd) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  console.warn(`[dev] ${name} is not set. Using a temporary value (see server/.env.example).`);
  return devFallback;
}

export const config = {
  isProd,
  port: Number(process.env.PORT) || 4000,
  jwtSecret: required('JWT_SECRET', crypto.randomBytes(32).toString('hex')),
  demoPassword: required('DEMO_PASSWORD', 'OneGov!2026'),
};

if (isProd && config.jwtSecret.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters in production.');
  process.exit(1);
}
