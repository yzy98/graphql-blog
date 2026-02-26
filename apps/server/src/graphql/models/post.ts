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
