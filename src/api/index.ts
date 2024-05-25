import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';

import { initDb } from '@/api/libs/db';
import { initLucia } from '@/api/libs/lucia';
import { sessionMiddleware } from '@/api/middleware/sessionMiddleware';
import { authRoutes } from '@/api/routes/auth';
import { todoRoutes } from '@/api/routes/todos';
import { type HonoContext } from '@/api/types';

const DEV_URL = 'http://localhost:5173';
const PREVIEW_URL = 'http://localhost:8788';

const app = new Hono<HonoContext>();

app.use(logger());
app.use(
  cors({
    allowHeaders: ['Content-Type', 'Authorization', 'Origin'],
    allowMethods: ['GET', 'HEAD', 'POST', 'PUT', 'OPTIONS'],
    credentials: true,
    exposeHeaders: ['Content-Length', 'Set-Cookie'],
    maxAge: 600,
    origin: (origin) =>
      origin.endsWith('.pages.dev')
        ? origin
        : origin === PREVIEW_URL
          ? PREVIEW_URL
          : DEV_URL,
  }),
);
app.use(
  '*',
  csrf({
    origin: (origin) =>
      origin.endsWith('.pages.dev') ||
      origin === 'http://localhost:8788' ||
      origin === DEV_URL,
  }),
);

app.use('*', async (c, next) => {
  const db = initDb(c.env.DATABASE_URL);
  const lucia = initLucia(c, db);
  c.set('db', db);
  c.set('lucia', lucia);
  return await next();
});

app.use('*', sessionMiddleware);

const route = app
  .basePath('/api')
  .get('/', (c) => {
    return c.json({
      message: 'Hello World!',
    });
  })
  .route('/auth', authRoutes)
  .route('/todos', todoRoutes);

export type AppType = typeof route;

export default app;
