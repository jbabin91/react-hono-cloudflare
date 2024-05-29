/* eslint-disable sort-keys-fix/sort-keys-fix */
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { generateId } from 'lucia';
import { z } from 'zod';

export const roles = {
  admin: 'ADMIN',
  user: 'USER',
} as const;

export const roleEnum = pgEnum('role', [roles.admin, roles.user]);

export type Roles = (typeof roles)[keyof typeof roles];

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  name: text('name').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  teamId: text('team_id')
    .notNull()
    .references(() => teams.id),
  role: roleEnum('role').notNull().default(roles.user),
  bio: text('bio'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const registerUserSchema = insertUserSchema
  .merge(
    z
      .object({
        teamId: z.string(),
        teamName: z.string(),
      })
      .partial(),
  )
  .omit({
    id: true,
    bio: true,
    role: true,
    name: true,
    createdAt: true,
  });
export const loginUserSchema = insertUserSchema.pick({
  email: true,
  password: true,
});
export const updateUserSchema = insertUserSchema.partial();
export const selectUserSchema = createSelectSchema(users);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
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

export const teams = pgTable('teams', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams);
export const createTeamSchema = insertTeamSchema.omit({
  description: true,
});
export const selectTeamSchema = createSelectSchema(teams);

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type CreateTeam = z.infer<typeof createTeamSchema>;
export type SelectTeam = z.infer<typeof selectTeamSchema>;

export const discussions = pgTable('discussions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  title: text('title').notNull(),
  body: text('body').notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id),
  teamId: text('team_id')
    .notNull()
    .references(() => teams.id),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
});

export const insertDiscussionSchema = createInsertSchema(discussions);
export const createDiscussionSchema = insertDiscussionSchema.omit({
  authorId: true,
});
export const updateDiscussionSchema = insertDiscussionSchema.partial();
export const selectDiscussionSchema = createSelectSchema(discussions);

export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type CreateDiscussion = z.infer<typeof createDiscussionSchema>;
export type UpdateDiscussion = z.infer<typeof updateDiscussionSchema>;
export type SelectDiscussion = z.infer<typeof selectDiscussionSchema>;

export const comments = pgTable('comments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  body: text('body').notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id),
  discussionId: text('discussion_id')
    .notNull()
    .references(() => discussions.id),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments);
export const createCommentSchema = insertCommentSchema.omit({
  authorId: true,
});
export const updateCommentSchema = insertCommentSchema.partial();
export const selectCommentSchema = createSelectSchema(comments);

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;
export type UpdateComment = z.infer<typeof updateCommentSchema>;
export type SelectComment = z.infer<typeof selectCommentSchema>;
