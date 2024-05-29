/* eslint-disable sort-keys-fix/sort-keys-fix */
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { Scrypt } from 'lucia';

import { type HonoContext } from '@/api/types';
import {
  loginUserSchema,
  registerUserSchema,
  type Roles,
  roles,
  teams,
  users,
} from '@/db/schema';

export const authRoutes = new Hono<HonoContext>()
  .get('/me', (c) => {
    try {
      return c.json(c.var.user);
    } catch (error: any) {
      console.error(error);
      return c.json(
        { message: error?.message || 'Internal Server Error' },
        500,
      );
    }
  })
  .post('/register', zValidator('form', registerUserSchema), async (c) => {
    const db = c.get('db');
    const lucia = c.get('lucia');
    const data = c.req.valid('form');
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (existingUser) {
        return c.json({ message: 'Invalid email or password' }, 400);
      }

      let teamId;
      let role: Roles;

      if (data.teamId) {
        const existingTeam = await db.query.teams.findFirst({
          where: eq(teams.id, data.teamId),
        });

        if (!existingTeam) {
          return c.json(
            { message: 'The team you are trying to join does not exist' },
            400,
          );
        }
        teamId = data.teamId;
        role = roles.user;
      } else {
        const team = await db
          .insert(teams)
          .values({
            name: data.teamName ?? `${data.firstName}'s Team`,
          })
          .returning()
          .then((res) => res[0]);
        teamId = team.id;
        role = roles.admin;
      }

      const hashedPassword = await new Scrypt().hash(data.password);

      const user = await db
        .insert(users)
        .values({
          ...data,
          name: `${data.firstName} ${data.lastName}`,
          role,
          teamId,
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
    } catch (error: any) {
      console.error(error);
      return c.json(
        { message: error?.message || 'Internal Server Error' },
        500,
      );
    }
  })
  .post('/login', zValidator('form', loginUserSchema), async (c) => {
    const db = c.get('db');
    const lucia = c.get('lucia');
    const data = c.req.valid('form');
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (!existingUser) {
        return c.json({ message: 'Invalid email or password' }, 400);
      }

      const verifyPassword = await new Scrypt().verify(
        existingUser.password,
        data.password,
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
        teamId: existingUser.teamId,
        role: existingUser.role,
        bio: existingUser.bio,
        createdAt: existingUser.createdAt,
      };

      return c.json(user);
    } catch (error: any) {
      console.error(error);
      return c.json(
        { message: error?.message || 'Internal Server Error' },
        500,
      );
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
    } catch (error: any) {
      console.error(error);
      return c.json(
        { message: error?.message || 'Internal Server Error' },
        500,
      );
    }
  });
