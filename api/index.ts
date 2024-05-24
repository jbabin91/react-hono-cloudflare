import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import { z } from 'zod';

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: (origin) =>
      origin.endsWith('.pages.dev') ? origin : 'http://localhost:5173',
  }),
);
app.use(
  '*',
  csrf({
    origin: (origin) =>
      origin.endsWith('.pages.dev') || origin === 'http://localhost:5173',
  }),
);

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
    setCookie(c, 'todos', JSON.stringify(todos));
    return c.json({
      message: 'created!',
    });
  })
  .get('/todo', (c) => {
    const todosCookie = getCookie(c, 'todos');
    console.log(todosCookie);
    return c.json({
      todos,
    });
  });

export type AppType = typeof route;

export default app;
