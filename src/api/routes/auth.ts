/* eslint-disable sort-keys-fix/sort-keys-fix */
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { Scrypt } from 'lucia';

import { type HonoContext } from '@/api/types';
import { loginUserSchema, registerUserSchema, users } from '@/db/schema';

export const authRoutes = new Hono<HonoContext>()
  .get('/me', (c) => {
    return c.json(c.var.user);
  })
  .post('/register', zValidator('form', registerUserSchema), async (c) => {
    const db = c.get('db');
    const lucia = c.get('lucia');
    const { firstName, lastName, email, password } = c.req.valid('form');
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        return c.json({ message: 'Invalid email or password' }, 400);
      }

      const hashedPassword = await new Scrypt().hash(password);

      const user = await db
        .insert(users)
        .values({
          email,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          password: hashedPassword,
        })
        .returning()
        .then((res) => res[0]);

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      c.header('Set-Cookie', sessionCookie.serialize(), {
        append: true,
      });

      return c.json(user, 201);
    } catch (error) {
      console.log(error);
      return c.json({ message: 'Internal server error' }, 500);
    }
  })
  .post('/login', zValidator('form', loginUserSchema), async (c) => {
    const db = c.get('db');
    const lucia = c.get('lucia');
    const { email, password } = c.req.valid('form');
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!existingUser) {
        return c.json({ message: 'Invalid email or password' }, 400);
      }

      const verifyPassword = await new Scrypt().verify(
        existingUser.password,
        password,
      );

      if (!verifyPassword) {
        return c.json({ message: 'Invalid email or password' }, 400);
      }

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      c.header('Set-Cookie', sessionCookie.serialize(), {
        append: true,
      });

      const user = {
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        name: existingUser.name,
        email: existingUser.email,
      };

      return c.json(user);
    } catch (error) {
      console.log(error);
      return c.json({ message: 'Internal server error' }, 500);
    }
  })
  .post('/logout', async (c) => {
    const lucia = c.get('lucia');
    const session = c.get('session');
    try {
      if (!session) {
        return c.json(null, 401);
      }
      await lucia.invalidateSession(session.id);
      c.set('session', null);
      c.set('user', null);
      return c.json(null);
    } catch (error) {
      console.log(error);
      return c.json({ message: 'Internal server error' }, 500);
    }
  });
