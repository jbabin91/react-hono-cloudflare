import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { type HonoContext } from '@/api/types';

export const authMiddleware = createMiddleware<HonoContext>(async (c, next) => {
  const lucia = c.get('lucia');
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
  // console.log('authMiddleware sessionId:', sessionId);
  if (!sessionId) {
    c.set('user', null);
    c.set('session', null);
    return c.json({ message: 'Unauthorized' }, 401);
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header('Set-Cookie', sessionCookie.serialize(), {
      append: true,
    });
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    c.header('Set-Cookie', sessionCookie.serialize(), {
      append: true,
    });
  }
  c.set('user', user);
  c.set('session', session);
  return await next();
});
