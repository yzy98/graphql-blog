import { prisma } from "../../prisma/client";
import { builder } from "../builder";

builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content"),
    comments: t.relation("comments"),
  }),
});

builder.queryField("posts", (t) =>
  t.prismaField({
    type: ["Post"],
    resolve: async (query, _root, _args, _ctx, _info) => {
      return await prisma.post.findMany({ ...query });
    },
  })
);

builder.queryField("post", (t) =>
  t.prismaField({
    type: "Post",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, args, _ctx, _info) => {
      return await prisma.post.findUnique({
        ...query,
        where: { id: Number(args.id) },
      });
    },
  })
);

builder.mutationField("createPost", (t) =>
  t.prismaField({
    type: "Post",
    args: {
      title: t.arg.string({ required: true }),
      content: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      const newPost = await prisma.post.create({
        ...query,
        data: {
          title: args.title,
          content: args.content,
        },
      });

      ctx.pubsub.publish("POST_CREATED", {
        post: newPost,
      });

      return newPost;
    },
  })
);

builder.subscriptionField("postCreated", (t) =>
  t.prismaField({
    type: "Post",
    subscribe: (_parent, _args, ctx) => ctx.pubsub.subscribe("POST_CREATED"),
    resolve: (_query, payload) => payload.post,
  })
);
