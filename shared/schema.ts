import { pgTable, text, uuid, jsonb, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Track type for playlists
export type Track = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  image_url: string;
};

// Playlist table
export const playlists = pgTable("playlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull(),
  url: text("url").notNull(),
  service: text("service").notNull(), // 'spotify' or 'apple'
  color: text("color").notNull(), // 'silver', 'black', 'pink', 'green', 'blue'
  title: text("title").notNull(),
  description: text("description"),
  image_url: text("image_url"),
  creator: text("creator"),
  tracks: jsonb("tracks").$type<Track[]>(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Insert Schema
export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
  created_at: true,
  updated_at: true
});

// User Follow table (optional for MVP)
export const userFollows = pgTable("user_follows", {
  id: uuid("id").defaultRandom().primaryKey(),
  follower_id: uuid("follower_id").notNull().references(() => users.id),
  following_id: uuid("following_id").notNull().references(() => users.id),
  status: text("status").default("active").notNull(),
  blocked_by: uuid("blocked_by").references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// User table (for local development)
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  display_name: text("display_name"),
  avatar_url: text("avatar_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Insert Schema for users
export const insertUserSchema = createInsertSchema(users).omit({
  created_at: true
});

// Export types
export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type UserFollow = typeof userFollows.$inferSelect;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
