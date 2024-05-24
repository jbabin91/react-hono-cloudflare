import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

export function initDb(connectionString: string) {
  return drizzle(postgres(connectionString), { schema });
}
