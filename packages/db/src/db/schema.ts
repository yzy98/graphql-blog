import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("Post", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  content: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const comments = pgTable("Comment", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  postId: integer()
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
});

export const postsRelations = relations(posts, ({ many }) => ({
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
