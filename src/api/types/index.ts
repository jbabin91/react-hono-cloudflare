import { type Session, type User } from 'lucia';

import { type initDb } from '@/api/libs/db';
import { type initLucia } from '@/api/libs/lucia';

export type HonoContext = {
  Bindings: {
    DATABASE_URL: string;
    ENVIRONMENT: string;
  };
  Variables: {
    db: ReturnType<typeof initDb>;
    lucia: ReturnType<typeof initLucia>;
    user: User | null;
    session: Session | null;
  };
};
