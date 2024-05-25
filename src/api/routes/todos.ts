import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { authMiddleware } from '@/api/middleware/authMiddleware';
import { type HonoContext } from '@/api/types';
import { createTodoSchema, todos, todos as todosTable } from '@/db/schema';

export const todoRoutes = new Hono<HonoContext>()
  .use('*', authMiddleware)
  .post('/', zValidator('form', createTodoSchema), async (c) => {
    const db = c.get('db');
    const user = c.get('user');
    const todo = c.req.valid('form');
    try {
      await db.insert(todos).values({
        ...todo,
        authorId: user?.id ?? '',
      });
      return c.json(todo, 201);
    } catch (error) {
      console.log(error);
      return c.json({ message: 'Internal server error' }, 500);
    }
  })
  .get('/', async (c) => {
    const db = c.get('db');
    const user = c.get('user');
    try {
      const todos = await db.query.todos.findMany({
        where: eq(todosTable.authorId, user?.id ?? ''),
      });
      return c.json(todos);
    } catch (error) {
      console.log(error);
      return c.json({ message: 'Internal server error' }, 500);
    }
  });
