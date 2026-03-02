import type { Post } from "@packages/db";
import { comments } from "@packages/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/clients/db";
import { builder } from "../builder";
import { CommentRef } from "./comment";

export const PostRef = builder.objectRef<Post>("Post");

PostRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
    comments: t.field({
      type: [CommentRef],
      resolve: (post) =>
        db.select().from(comments).where(eq(comments.postId, post.id)),
    }),
  }),
});

builder.queryField("posts", (t) =>
  t.field({
    type: [PostRef],
    resolve: () => db.query.posts.findMany(),
  })
);
