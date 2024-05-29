import { Hono } from 'hono';

import { type HonoContext } from '@/api/types';

export const teamRoutes = new Hono<HonoContext>().get('/', async (c) => {
  const db = c.get('db');
  try {
    const result = await db.query.teams.findMany();
    return c.json(result);
  } catch (error: any) {
    console.error(error);
    return c.json({ message: error?.message || 'Internal Server Error' }, 500);
  }
});
