import type { Comment } from "@packages/db";
import { comments } from "@packages/db/schema";
import { db } from "@/clients/db";
import { builder } from "../builder";

export const CommentRef = builder.objectRef<Comment>("Comment");

CommentRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    content: t.exposeString("content"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
  }),
});

builder.mutationField("createComment", (t) =>
  t.field({
    type: CommentRef,
    args: {
      postId: t.arg.id({ required: true }),
      content: t.arg.string({ required: true }),
    },
    resolve: async (_root, args) => {
      const [newComment] = await db
        .insert(comments)
        .values({
          postId: Number(args.postId),
          content: args.content,
        })
        .returning();
      return newComment;
    },
  })
);
