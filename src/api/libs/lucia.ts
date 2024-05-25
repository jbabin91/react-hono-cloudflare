import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';

import { type initDb } from '@/api/libs/db';
import { sessions, users } from '@/db/schema';

export function initLucia(db: ReturnType<typeof initDb>) {
  const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);
  const lucia = new Lucia(adapter, {
    getUserAttributes: (attributes) => ({
      email: attributes.email,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      name: attributes.name,
    }),
    sessionCookie: {
      attributes: {
        secure: true,
      },
    },
  });
  return lucia;
}

declare module 'lucia' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    Lucia: ReturnType<typeof initLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type DatabaseUserAttributes = {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
};
