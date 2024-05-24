import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { type HonoContext } from '@/api/types';
import { insertTodoSchema, todos } from '@/db/schema';

export const todoRoutes = new Hono<HonoContext>()
  .post('/', zValidator('form', insertTodoSchema), async (c) => {
    const db = c.get('db');
    const todo = c.req.valid('form');

    await db.insert(todos).values(todo);

    return c.json({
      message: 'created!',
    });
  })
  .get('/', async (c) => {
    const db = c.get('db');
    try {
      const existingTodos = await db.query.todos.findMany();
      return c.json({
        todos: existingTodos,
      });
    } catch (error) {
      console.log(error);
      return c.json(null, 500);
    }
  });
