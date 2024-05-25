import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { type HonoContext } from '@/api/types';

export const sessionMiddleware = createMiddleware<HonoContext>(
  async (c, next) => {
    const lucia = c.get('lucia');
    const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
    console.log('sessionMiddleware sessionId:', sessionId);
    if (!sessionId) {
      c.set('user', null);
      c.set('session', null);
      return await next();
    }
    const { session, user } = await lucia.validateSession(sessionId);
    if (session?.fresh) {
      c.header(
        'Set-Cookie',
        lucia.createSessionCookie(session.id).serialize(),
        {
          append: true,
        },
      );
    }
    if (!session) {
      c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), {
        append: true,
      });
    }
    c.set('user', user);
    c.set('session', session);
    return await next();
  },
);
