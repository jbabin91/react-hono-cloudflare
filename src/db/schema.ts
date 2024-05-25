/* eslint-disable sort-keys-fix/sort-keys-fix */
import { sql } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { generateId } from 'lucia';
import { type z } from 'zod';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  name: text('name').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const registerUserSchema = insertUserSchema.omit({
  id: true,
  name: true,
  createdAt: true,
});
export const loginUserSchema = insertUserSchema.pick({
  email: true,
  password: true,
});
export const selectUserSchema = createSelectSchema(users);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const todos = pgTable('todos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const insertTodoSchema = createInsertSchema(todos);
export const createTodoSchema = insertTodoSchema.omit({
  authorId: true,
});
export const selectTodoSchema = createSelectSchema(todos);

export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type CreateTodo = z.infer<typeof createTodoSchema>;
export type SelectTodo = z.infer<typeof selectTodoSchema>;
