import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono();

const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
});

type Todo = z.infer<typeof todoSchema>;

const todos: Todo[] = [];

const route = app
  .basePath('/api')
  .get('/', (c) => {
    return c.json({
      message: 'Hello World!',
    });
  })
  .post('/todo', zValidator('form', todoSchema), (c) => {
    const todo = c.req.valid('form');
    todos.push(todo);
    return c.json({
      message: 'created!',
    });
  })
  .get('/todo', (c) => {
    return c.json({
      todos,
    });
  });

export type AppType = typeof route;

export default app;
