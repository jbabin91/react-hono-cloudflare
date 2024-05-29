import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { type HonoContext } from '@/api/types';
import { comments, createCommentSchema } from '@/db/schema';

export const commentRoutes = new Hono<HonoContext>()
  .get('/', async (c) => {
    const db = c.get('db');
    try {
      const comments = await db.query.comments.findMany();
      return c.json(comments);
    } catch (error: any) {
      console.error(error);
      return c.json(
        { message: error?.message || 'Internal Server Error' },
        500,
      );
    }
  })
  .post('/', zValidator('form', createCommentSchema), async (c) => {
    const db = c.get('db');
    const user = c.get('user');
    const data = c.req.valid('form');
    try {
      if (user) {
        const result = await db
          .insert(comments)
          .values({
            ...data,
            authorId: user.id,
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
  .delete('/:commentId', async (c) => {
    const db = c.get('db');
    const user = c.get('user');
    const commentId = c.req.param('commentId');
    try {
      if (user) {
        await db
          .delete(comments)
          .where(
            user.role === 'USER'
              ? and(eq(comments.id, commentId), eq(comments.authorId, user.id))
              : eq(comments.id, commentId),
          );
      }
      return c.json(null);
    } catch (error: any) {
      console.error(error);
      return c.json(
        { message: error?.message || 'Internal Server Error' },
        500,
      );
    }
  });
