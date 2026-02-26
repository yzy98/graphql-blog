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
    resolve: async (query, _root, args, _ctx, _info) => {
      return await prisma.comment.create({
        ...query,
        data: {
          postId: Number(args.postId),
          content: args.content,
        },
      });
    },
  })
);
