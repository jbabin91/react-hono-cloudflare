import { type AppType } from '@api';
import { hc } from 'hono/client';

export const client = hc<AppType>('/');
