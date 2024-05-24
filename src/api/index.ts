import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';

import { todoRoutes } from '@/api/routes/todos';
import { type HonoContext } from '@/api/types';
import { initDb } from '@/db/db';

const DEV_URL = 'http://localhost:5173';
const PREVIEW_URL = 'http://localhost:8788';

const app = new Hono<HonoContext>();

app.use(logger());
app.use(
  cors({
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
  console.log('DATABASE_URL', c.env.DATABASE_URL);
  const db = initDb(c.env.DATABASE_URL);
  c.set('db', db);
  return await next();
});

const route = app
  .basePath('/api')
  .get('/', (c) => {
    return c.json({
      message: 'Hello World!',
    });
  })
  .route('/todos', todoRoutes);

export type AppType = typeof route;

export default app;
