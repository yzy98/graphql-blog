import { prisma } from "../../prisma/client";
import { builder } from "../builder";

builder.prismaObject("Comment", {
  fields: (t) => ({
    id: t.exposeID("id"),
    content: t.exposeString("content"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
  }),
});

builder.mutationField("createComment", (t) =>
  t.prismaField({
    type: "Comment",
    args: {
      postId: t.arg.id({ required: true }),
      content: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      const newComment = await prisma.comment.create({
        ...query,
        data: {
          postId: Number(args.postId),
          content: args.content,
        },
      });

      ctx.pubsub.publish("COMMENT_CREATED", Number(args.postId), {
        comment: newComment,
      });

      return newComment;
    },
  })
);

builder.subscriptionField("commentCreated", (t) =>
  t.prismaField({
    type: "Comment",
    args: {
      postId: t.arg.id({ required: true }),
    },
    subscribe: (_parent, args, ctx) =>
      ctx.pubsub.subscribe("COMMENT_CREATED", Number(args.postId)),
    resolve: (_query, payload) => payload.comment,
  })
);
