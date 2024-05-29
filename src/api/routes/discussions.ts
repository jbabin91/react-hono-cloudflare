import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { type HonoContext } from '@/api/types';
import {
  createDiscussionSchema,
  discussions,
  updateDiscussionSchema,
} from '@/db/schema';

export const discussionRoutes = new Hono<HonoContext>()
  .get('/', async (c) => {
    const db = c.get('db');
    const user = c.get('user');
    try {
      if (user) {
        const result = await db.query.discussions.findMany({
          where: and(
            eq(discussions.teamId, user.teamId),
            eq(discussions.authorId, user.id),
          ),
        });
        return c.json(result);
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
  .get('/:discussionId', async (c) => {
    const db = c.get('db');
    const discussionId = c.req.param('discussionId');
    try {
      const result = await db.query.discussions.findFirst({
        where: eq(discussions.id, discussionId),
      });
      return c.json(result);
    } catch (error: any) {
      console.error(error);
      return c.json(
        { message: error?.message || 'Internal Server Error' },
        500,
      );
    }
  })
  .post('/', zValidator('form', createDiscussionSchema), async (c) => {
    const db = c.get('db');
    const user = c.get('user');
    const data = c.req.valid('form');
    try {
      if (user) {
        const result = await db
          .insert(discussions)
          .values({
            ...data,
            authorId: user.id,
            teamId: user.teamId,
          })
          .returning()
          .then((res) => res[0]);
        return c.json(result, 201);
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
  .patch(
    '/:discussionId',
    zValidator('form', updateDiscussionSchema),
    async (c) => {
      const db = c.get('db');
      const discussionId = c.req.param('discussionId');
      const data = c.req.valid('form');
      try {
        const result = await db
          .update(discussions)
          .set(data)
          .where(eq(discussions.id, discussionId))
          .returning()
          .then((res) => res[0]);
        return c.json(result);
      } catch (error: any) {
        console.error(error);
        return c.json(
          { message: error?.message || 'Internal Server Error' },
          500,
        );
      }
    },
  )
  .delete('/:discussionId', async (c) => {
    const db = c.get('db');
    const discussionId = c.req.param('discussionId');
    try {
      await db.delete(discussions).where(eq(discussions.id, discussionId));
      return c.json(null);
    } catch (error: any) {
      console.error(error);
      return c.json(
        { message: error?.message || 'Internal Server Error' },
        500,
      );
    }
  });
