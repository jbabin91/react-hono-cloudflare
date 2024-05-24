import 'dotenv/config';

import { type Config } from 'drizzle-kit';

export default {
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  dialect: 'postgresql',
  out: 'drizzle',
  schema: './src/db/schema.ts',
} satisfies Config;
