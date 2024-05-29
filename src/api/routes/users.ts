import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { type HonoContext } from '@/api/types';
import { updateUserSchema, users } from '@/db/schema';

export const userRoutes = new Hono<HonoContext>()
  .get('/', async (c) => {
    const db = c.get('db');
    const user = c.get('user');
    try {
      if (user) {
        const results = await db.query.users.findMany({
          where: eq(users.teamId, user?.teamId),
        });
        return c.json(results);
      }
      return c.json([]);
    } catch (error: any) {
      console.error(error);
      return c.json(
        { message: error?.message || 'Internal Server Error' },
        500,
      );
    }
  })
  .patch('/profile', zValidator('form', updateUserSchema), async (c) => {
    const db = c.get('db');
    const user = c.get('user');
    const data = c.req.valid('form');
    try {
      if (user) {
        const result = await db
          .update(users)
          .set(data)
          .where(eq(users.id, user?.id))
          .returning()
          .then((res) => res[0]);
        return c.json(result);
      }
      return c.json(null);
    } catch (error: any) {
      console.error(error);
      return c.json(
        { message: error?.message || 'Internal Server Error' },
        500,
      );
    }
  })
  .delete('/:userId', async (c) => {
    const db = c.get('db');
    const userId = c.req.param('userId');
    try {
      await db.delete(users).where(eq(users.id, userId));
      return c.json(null);
    } catch (error: any) {
      console.error(error);
      return c.json(
        { message: error?.message || 'Internal Server Error' },
        500,
      );
    }
  });
