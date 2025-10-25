// Database Schema for Auth & App
import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'), // Nullable for OAuth-only users
  googleId: text('google_id').unique(), // Google OAuth ID
  authProvider: text('auth_provider').notNull().default('credentials'), // 'credentials' | 'google'
  role: text('role').notNull().default('user'),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Refresh Tokens table
export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Agencies table
export const agencies = pgTable('agencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Enums
export const agencyUserRole = pgEnum('agency_user_role', ['admin', 'editor']);
export const postStatus = pgEnum('post_status', [
  'pending',
  'posted',
  'failed',
]);
export const messageStatus = pgEnum('message_status', ['unread', 'read']);

// Agency Users (many-to-many between agencies and users)
export const agencyUsers = pgTable('agency_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id')
    .notNull()
    .references(() => agencies.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: agencyUserRole('role').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Platforms (supported platforms)
export const platforms = pgTable('platforms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  apiBaseUrl: text('api_base_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Social Accounts (connected accounts)
export const socialAccounts = pgTable('social_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id')
    .notNull()
    .references(() => agencies.id, { onDelete: 'cascade' }),
  platformId: uuid('platform_id')
    .notNull()
    .references(() => platforms.id, { onDelete: 'cascade' }),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  username: text('username').notNull(),
  profileUrl: text('profile_url'),
  profilePicture: text('profile_picture'),
  accountId: text('account_id'), // Platform-specific account ID (e.g., Facebook Page ID)
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Posts
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id')
    .notNull()
    .references(() => agencies.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  media: jsonb('media'),
  scheduledAt: timestamp('scheduled_at'),
  status: postStatus('status').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Post Platform Status (per-platform posting status)
export const postPlatformStatus = pgTable('post_platform_status', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  platformId: uuid('platform_id')
    .notNull()
    .references(() => platforms.id, { onDelete: 'cascade' }),
  status: postStatus('status').notNull(),
  response: jsonb('response'),
  postedAt: timestamp('posted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Messages (centralized chat)
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  socialAccountId: uuid('social_account_id')
    .notNull()
    .references(() => socialAccounts.id, { onDelete: 'cascade' }),
  messageExternalId: text('message_id').notNull(),
  senderName: text('sender_name'),
  senderId: text('sender_id'),
  content: text('content').notNull(),
  status: messageStatus('status').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// AI Generated Content
export const aiGeneratedContent = pgTable('ai_generated_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id')
    .notNull()
    .references(() => agencies.id, { onDelete: 'cascade' }),
  prompt: text('prompt').notNull(),
  result: text('result').notNull(),
  usedInPostId: uuid('used_in_post_id').references(() => posts.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
