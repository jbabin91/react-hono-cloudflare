import { type Session, type User } from 'lucia';

import { type initDb } from '@/db/db';

export type HonoContext = {
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    db: ReturnType<typeof initDb>;
    user: User | null;
    session: Session | null;
  };
};
